import type { LinksFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Outlet, Link, useLoaderData } from '@remix-run/react';
import stylesUrl from '~/styles/jokes.css';
import { db } from '~/utils/db.server';
import { getUser } from '~/utils/session.server';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  jokeListItems: Array<{ id: string; name: string }>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const jokeListItems = await db.joke.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true },
  });
  const user = await getUser(request);

  const data: LoaderData = {
    jokeListItems,
    user,
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
              <span className="logo">๐</span>
              <span className="logo-medium">๋๋ด ๋ฐ๋จน๊ธฐ</span>
            </Link>
          </h1>
          {data.user ? (
            <div className="user-info">
              <span>{`Hi ${data.user.username}`}</span>
              <form action="/logout" method="post">
                <button type="submit" className="button">
                  ๋ก๊ทธ์์
                </button>
              </form>
            </div>
          ) : (
            <Link to="/login">๋ก๊ทธ์ธ</Link>
          )}
        </div>
      </header>

      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">๋ฌด์์ ๋๋ด ๋ถ๋ฌ์ค๊ธฐ</Link>
            <p>์ฌ๊ธฐ ํ์ธํด์ผ ํ  ๋ช๊ฐ์ง ๋๋ด์ด ์์ต๋๋ค.</p>

            <ul>
              {data.jokeListItems.map((joke) => (
                <li key={joke.id}>
                  <Link prefetch="intent" to={joke.id}>
                    {joke.name}
                  </Link>
                </li>
              ))}
            </ul>

            <Link to="new" className="button">
              ์ ๋๋ด ๋ฑ๋ก
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
