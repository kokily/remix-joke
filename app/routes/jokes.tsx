import type { LinksFunction } from '@remix-run/node';
import { Outlet, Link } from '@remix-run/react';
import stylesUrl from '~/styles/jokes.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

function JokesRoute() {
  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="Remix Jokes" aria-label="Remix Jokes">
              <span className="logo">로고</span>
              <span className="logo-medium">로고이름</span>
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
              <li>
                <Link to="some-joke-id">하마</Link>
              </li>
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
