import prisma from '$lib/prisma';
import * as jwt from 'jsonwebtoken';
import { createErrorResponse } from '$lib/utils/helpers';
import type { RequestHandler } from '@sveltejs/kit';
import type { UserCookieInfo } from '$lib/utils/interfaces';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const body = await request.json();
  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const cookieUserId = userInfo?.user_id;

  if (cookieUserId != body.userid) {
    return createErrorResponse(`Forbidden`, 403);
  }

  if (body.productid && body.userid && body.ratingValue) {
    const { productid, ratingValue, userid } = body;

    await prisma.ratings.create({
      data: {
        rating: ratingValue,
        userid,
        productid,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Rating created successfully',
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  }

  return createErrorResponse('Unknown error', 500);
};

export const PUT: RequestHandler = async ({ request, cookies }) => {
  const body = await request.json();
  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const cookieUserId = userInfo?.user_id;

  if (cookieUserId != body.userid) {
    return createErrorResponse(`Forbidden`, 403);
  }

  if (body.ratingid && body.ratingValue) {
    const { ratingid, ratingValue } = body;

    await prisma.ratings.update({
      where: {
        ratingid,
      },
      data: {
        rating: ratingValue,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Rating changed successfully',
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  }

  return createErrorResponse('Unknown error', 500);
};

export const DELETE: RequestHandler = async ({ request, cookies }) => {
  const body = await request.json();
  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const cookieUserId = userInfo?.user_id;

  if (cookieUserId != body.userid) {
    return createErrorResponse(`Forbidden`, 403);
  }

  if (body.ratingid) {
    await prisma.ratings.delete({
      where: {
        ratingid: body.ratingid,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Rating deleted successfully',
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  }

  return createErrorResponse('Unknown error', 500);
};
