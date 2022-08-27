import {
  ActionFunction,
  json,
  LinksFunction,
  MetaFunction,
} from '@remix-run/node';
import { Link, useActionData, useSearchParams } from '@remix-run/react';
import { db } from '~/utils/db.server';
import { createUserSession, login, register } from '~/utils/session.server';
import stylesUrl from '../styles/login.css';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: stylesUrl,
    },
  ];
};

export const meta: MetaFunction = () => {
  return {
    title: 'Remix Jokes | Login',
    description: 'Login to submit your own jokes to Remix Jokes!',
  };
};

function validateUsername(username: unknown) {
  if (typeof username !== 'string' || username.length < 3) {
    return `Username must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== 'string' || password.length < 6) {
    return `Password must be at least 6 characters long`;
  }
}

function validateUrl(url: any) {
  console.log(url);

  let urls = ['/jokes', '/', 'https://remix.run'];

  if (urls.includes(url)) {
    return url;
  }

  return '/jokes';
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username: string | undefined;
    password: string | undefined;
  };
  fields?: {
    loginType: string;
    username: string;
    password: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const loginType = form.get('loginType');
  const username = form.get('username');
  const password = form.get('password');
  const redirectTo = validateUrl(form.get('redirectTo') || '/jokes');

  if (
    typeof loginType !== 'string' ||
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    typeof redirectTo !== 'string'
  ) {
    return badRequest({
      formError: `Form not submitted correctly`,
    });
  }

  const fields = { loginType, username, password };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  switch (loginType) {
    case 'login': {
      const user = await login({ username, password });
      console.log(user);

      if (!user) {
        return badRequest({
          fields,
          formError: 'Username/Password combination is incorrect',
        });
      }

      return createUserSession(user.id, redirectTo);
    }
    case 'register': {
      const userExists = await db.user.findFirst({ where: { username } });

      if (userExists) {
        return badRequest({
          fields,
          formError: `User with username ${username} already exists`,
        });
      }

      const user = await register({ username, password });

      if (!user) {
        return badRequest({
          fields,
          formError: 'Something went wrong trying to create a new user.',
        });
      }

      return createUserSession(user.id, redirectTo);
    }
    default: {
      return badRequest({
        fields,
        formError: `Login type invalid`,
      });
    }
  }
};

function Login() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();

  return (
    <div className="container">
      <div className="content" data-light="">
        <h1>로그인</h1>
        <form method="post">
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get('redirectTo') ?? undefined}
          />

          <fieldset>
            <legend className="sr-only">로그인 / 등록</legend>

            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === 'login'
                }
              />{' '}
              로그인
            </label>
            <label>
              <input
                type="radio"
                name="loginType"
                value="register"
                defaultChecked={actionData?.fields?.loginType === 'register'}
              />{' '}
              등록
            </label>
          </fieldset>

          <div>
            <label htmlFor="username-input">아이디</label>
            <input
              type="text"
              id="username-input"
              name="username"
              defaultValue={actionData?.fields?.username}
              aria-invalid={Boolean(actionData?.fieldErrors?.username)}
              aria-errormessage={
                actionData?.fieldErrors?.username ? 'username-error' : undefined
              }
            />
            {actionData?.fieldErrors?.username ? (
              <p
                className="form-validation-error"
                role="alert"
                id="username-error"
              >
                {actionData.fieldErrors.username}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="password-input">비밀번호</label>
            <input
              type="password"
              id="password-input"
              name="password"
              defaultValue={actionData?.fields?.password}
              aria-invalid={
                Boolean(actionData?.fieldErrors?.password) || undefined
              }
              aria-errormessage={
                actionData?.fieldErrors?.password ? 'password-error' : undefined
              }
            />
            {actionData?.fieldErrors?.password ? (
              <p
                className="form-validation-error"
                role="alert"
                id="password-error"
              >
                {actionData.fieldErrors.password}
              </p>
            ) : null}
          </div>

          <button type="submit" className="button">
            전송
          </button>
        </form>
      </div>

      <div className="links">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/jokes">Jokes</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Login;
