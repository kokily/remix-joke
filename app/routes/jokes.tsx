import type { LinksFunction, LoaderFunction } from '@remix-run/node';
import type { Joke } from '@prisma/client';
import { json } from '@remix-run/node';
import { Outlet, Link, useLoaderData } from '@remix-run/react';
import stylesUrl from '~/styles/jokes.css';
import { db } from '~/utils/db.server';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

type LoaderData = {
  jokeListItems: Array<Joke>;
};

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    jokeListItems: await db.joke.findMany(),
  };

  return json(data);
};

function JokesRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="Remix Jokes" aria-label="Remix Jokes">
              <span className="logo">😀</span>
              <span className="logo-medium">농담 따먹기</span>
            </Link>
          </h1>
        </div>
      </header>

      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">무작위 농담 불러오기</Link>
            <p>여기 확인해야 할 몇가지 농담이 있습니다.</p>

            <ul>
              {data.jokeListItems.map((joke) => (
                <li key={joke.id}>
                  <Link to={joke.id}>{joke.name}</Link>
                </li>
              ))}
            </ul>

            <Link to="new" className="button">
              새 농담 등록
            </Link>
          </div>

          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export default JokesRoute;
