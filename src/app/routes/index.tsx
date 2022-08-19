import { RequestHandler } from '@builder.io/qwik-city';

// E.g. Temporary workaround for [...lang] 
export const onGet: RequestHandler = ({ request, response }) => {
  const url = new URL(request.url);
  const [, lang] = url.pathname.split('/');

  if (!lang) {
    throw response.redirect('/en-US', 302);
  }
};
