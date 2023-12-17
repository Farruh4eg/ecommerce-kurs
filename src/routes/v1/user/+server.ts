import prisma from '$lib/prisma';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }: { url: URL }) => {
  const urlUserId = url.searchParams.get('q');

  let user = await prisma.users.findUnique({
    where: {
      userid: urlUserId!,
    },
    include: {
      addresses: true,
    },
  });

  const userJson = JSON.stringify(user, null, 2);

  return new Response(userJson, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const POST: RequestHandler = async (event) => {
  return new Response();
};
