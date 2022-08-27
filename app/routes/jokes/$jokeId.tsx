import type { Joke } from '@prisma/client';
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { db } from '~/utils/db.server';
import { Link, useCatch, useLoaderData, useParams } from '@remix-run/react';
import { getUserId, requireUserId } from '~/utils/session.server';

export const meta: MetaFunction = ({
  data,
}: {
  data: LoaderData | undefined;
}) => {
  return {
    title: data ? `"${data.joke.name}" Joke` : 'No Joke',
    description: data
      ? `Enjoy the "${data.joke.name}" joke and much more`
      : 'No joke found',
  };
};

type LoaderData = {
  joke: Joke;
  isOwner: boolean;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await getUserId(request);
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });

  if (!joke) {
    throw new Response('What a joke! Not found.', {
      status: 404,
    });
  }

  const data: LoaderData = {
    joke,
    isOwner: userId === joke.jokesterId,
  };

  return json(data);
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();

  if (form.get('_method') !== 'delete') {
    throw new Response(`The _method ${form.get('method')} is not supported`, {
      status: 400,
    });
  }

  const userId = await requireUserId(request);
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });

  if (!joke) {
    throw new Response("Can't delete what does not exist", {
      status: 404,
    });
  }

  if (joke.jokesterId !== userId) {
    throw new Response("Pssh, nice try. That's not your joke", { status: 401 });
  }

  await db.joke.delete({ where: { id: params.jokeId } });

  return redirect('/jokes');
};

function JokeRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <p>여기 당신의 재밌는 농담입니다:</p>
      <p>
        {data.joke.content} <b className="answer">{data.joke.name}</b>
      </p>

      <Link to=".">{data.joke.name} Permalink</Link>
      {data.isOwner && (
        <form method="post">
          <input type="hidden" name="_method" value="delete" />

          <button type="submit" className="button">
            삭제
          </button>
        </form>
      )}
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();

  switch (caught.status) {
    case 400: {
      return (
        <div className="error-container">
          What you're trying to do is not allowed.
        </div>
      );
    }
    case 404: {
      return (
        <div className="error-container">
          Huh? What the heck is {params.jokeId}
        </div>
      );
    }
    case 401: {
      return (
        <div className="error-container">
          Sorry, but {params.jokeId} is not your joke.
        </div>
      );
    }
    default: {
      throw new Error(`Unhandled error: ${caught.status}`);
    }
  }
}

export function ErrorBoundary() {
  const { jokeId } = useParams();

  return (
    <div className="error-container">
      {`There was an error loading joke by the id ${jokeId}. Sorry!`}
    </div>
  );
}

export default JokeRoute;
