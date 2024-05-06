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
    return createErrorResponse('Forbidden', 403);
  }

  const wishlist = await prisma.wishlists.findFirst({
    where: {
      userid,
      productid,
    },
  });

  if (wishlist == null) {
    await prisma.wishlists.create({
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
    return createErrorResponse('User not logged in', 403);
  }
  const wishlist = await prisma.wishlists.findMany({
    where: {
      userid: cookieUserId,
    },
    select: {
      productid: true,
    },
  });

  return new Response(JSON.stringify(wishlist), {
    headers: {
      'Content-Type': 'application/json',
    },
    status: 200,
  });
};

export const DELETE: RequestHandler = async ({ request, cookies }) => {
  const body = (await request.json()) as {
    userid: string;
    productid: string;
  };

  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const cookieUserId = userInfo.user_id;
  const { userid, productid } = body;

  if (cookieUserId != userid) {
    return createErrorResponse('Forbidden', 403);
  }

  const wishlist = await prisma.wishlists.findFirst({
    where: {
      userid,
      productid,
    },
    select: {
      wishlistid: true,
    },
  });

  const wishlistid = wishlist?.wishlistid;

  if (wishlistid) {
    await prisma.wishlists.delete({
      where: {
        wishlistid,
      },
    });
  }
  return new Response(
    JSON.stringify({
      success: true,
      message: 'Item has been deleted from wishlist',
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    }
  );
};
