import type { LinksFunction, MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import stylesUrl from '~/styles/index.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

export const meta: MetaFunction = () => ({
  title: 'Remix: Index Page',
  description: 'Remix jokes app. Learn Remix and laugh at the same time!',
});

function IndexRoute() {
  return (
    <div className="container">
      <div className="content">
        <h1>
          Remix <span>Jokes!</span>
        </h1>

        <nav>
          <ul>
            <li>
              <Link to="jokes">농담 보기</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default IndexRoute;
