import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  const body = (await request.json()) as Body;

  return new Response();
};
