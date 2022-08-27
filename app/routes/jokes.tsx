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
              <span className="logo">😀</span>
              <span className="logo-medium">농담 따먹기</span>
            </Link>
          </h1>
          {data.user ? (
            <div className="user-info">
              <span>{`Hi ${data.user.username}`}</span>
              <form action="/logout" method="post">
                <button type="submit" className="button">
                  로그아웃
                </button>
              </form>
            </div>
          ) : (
            <Link to="/login">로그인</Link>
          )}
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
