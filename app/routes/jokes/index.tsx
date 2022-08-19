import { json, LoaderFunction } from '@remix-run/node';
import type { Joke } from '@prisma/client';
import { db } from '~/utils/db.server';
import { Link, useLoaderData } from '@remix-run/react';

type LoaderData = {
  randomJoke: Joke;
};

export const loader: LoaderFunction = async () => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: randomRowNumber,
  });
  const data: LoaderData = { randomJoke };

  return json(data);
};

function JokesIndexRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <p>여기는 무작위 농담입니다:</p>
      <p>{data.randomJoke.content}</p>

      <Link to={data.randomJoke.id}>"{data.randomJoke.name}" Permalink</Link>
    </div>
  );
}

export default JokesIndexRoute;
