import prisma from '$lib/prisma';
import * as jwt from 'jsonwebtoken';
import { createErrorResponse } from '$lib/utils/helpers';
import type { RequestHandler } from '@sveltejs/kit';
import type { UserCookieInfo } from '$lib/utils/interfaces';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const body = (await request.json()) as {
    userid: string;
    productid: string;
  };

  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const cookieUserId = userInfo?.user_id;

  const { userid, productid } = body;

  if (cookieUserId != userid) {
    return createErrorResponse(`Forbidden`, 403);
  }

  const cart = await prisma.carts.findFirst({
    where: {
      userid,
      productid,
    },
  });

  if (cart == null) {
    await prisma.carts.create({
      data: {
        userid,
        productid,
      },
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Item has been added to wishlist',
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    }
  );
};

export const GET: RequestHandler = async ({ cookies }) => {
  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const cookieUserId = userInfo?.user_id;

  if (!cookieUserId) {
    return new Response(
      JSON.stringify({ success: false, message: 'User not logged in' })
    );
  }
  const cart = await prisma.carts.findMany({
    where: {
      userid: cookieUserId,
    },
    select: {
      productid: true,
    },
  });

  return new Response(JSON.stringify(cart), {
    headers: {
      'Content-Type': 'application/json',
    },
    status: 200,
  });
};
