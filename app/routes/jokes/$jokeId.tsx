import type { Joke } from '@prisma/client';
import { json, LoaderFunction } from '@remix-run/node';
import { db } from '~/utils/db.server';
import { Link, useCatch, useLoaderData, useParams } from '@remix-run/react';

type LoaderData = {
  joke: Joke;
};

export const loader: LoaderFunction = async ({ params }) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });

  if (!joke) {
    throw new Response('What a joke! Not found.', {
      status: 404,
    });
  }

  const data: LoaderData = { joke };

  return json(data);
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
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();

  if (caught.status === 404) {
    return (
      <div className="error-container">
        Huh? What the heck is "{params.jokeId}"?
      </div>
    );
  }

  throw new Error(`Unhandled error: ${caught.status}`);
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
