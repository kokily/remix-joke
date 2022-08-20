import { ActionFunction, json } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import { db } from '~/utils/db.server';

function validateJokeContent(content: string) {
  if (content.length < 10) {
    return `That joke is too short`;
  }
}

function validateJokeName(name: string) {
  if (name.length < 3) {
    return `That joke's name is too short`;
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    name: string | undefined;
    content: string | undefined;
  };
  fields?: {
    name: string;
    content: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const name = form.get('name');
  const content = form.get('content');

  if (typeof name !== 'string' || typeof content !== 'string') {
    return badRequest({ formError: `Form not submitted correctly` });
  }

  const fieldErrors = {
    name: validateJokeName(name),
    content: validateJokeContent(content),
  };

  const fields = { name, content };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const joke = await db.joke.create({ data: fields });
  return redirect(`/jokes/${joke.id}`);
};

function NewJokeRoute() {
  const actionData = useActionData<ActionData>();

  return (
    <div>
      <p>당신만의 재밌는 농담을 추가해보세요!</p>

      <form method="post">
        <div>
          <label>
            이름:
            <input
              type="text"
              name="name"
              defaultValue={actionData?.fields?.name}
              aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
              aria-errorMessage={
                actionData?.fieldErrors?.name ? 'name-error' : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p className="form-validation-error" role="alert" id="name-error">
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label>
            내용:
            <textarea
              name="content"
              defaultValue={actionData?.fields?.content}
              aria-invalid={
                Boolean(actionData?.fieldErrors?.content) || undefined
              }
              aria-errorMessage={
                actionData?.fieldErrors?.content ? 'content-error' : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.content ? (
            <p
              className="form-validation-error"
              role="alert"
              id="content-error"
            >
              {actionData.fieldErrors.content}
            </p>
          ) : null}
        </div>

        <div>
          {actionData?.formError ? <p>{actionData.formError}</p> : null}
          <button type="submit" className="button">
            추가
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewJokeRoute;
