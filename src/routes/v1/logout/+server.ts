import { dev } from '$app/environment';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async () => {
  const secure = dev ? '' : 'Secure;';

  const setCookieHeader = [
    `refresh-token=; Max-Age=0; Path=/; ${secure} HttpOnly`,
    `token=; Max-Age=0; Path=/;${secure} HttpOnly`,
  ].join(', ');

  return new Response(null, {
    status: 200,
    headers: {
      'Set-Cookie': setCookieHeader,
    },
  });
};
