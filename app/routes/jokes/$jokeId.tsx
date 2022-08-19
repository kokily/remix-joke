import { json, LoaderFunction } from '@remix-run/node';
import type { Joke } from '@prisma/client';
import { db } from '~/utils/db.server';
import { Link, useLoaderData } from '@remix-run/react';

type LoaderData = {
  joke: Joke;
};

export const loader: LoaderFunction = async ({ params }) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });

  if (!joke) throw new Error('Joke not found');

  const data = { joke };

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

export default JokeRoute;
