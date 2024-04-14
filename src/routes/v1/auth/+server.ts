import type { RequestHandler } from '@sveltejs/kit';
import { SECRET_ACCESS_TOKEN } from '$env/static/private';
import prisma from '$lib/prisma';
import * as jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { randomUUID } from 'crypto';

export const GET: RequestHandler = async ({ request }) => {
  let { token, refreshToken } = cookie.parse(
    request.headers.get('cookie') || ''
  );

  try {
    const user = jwt.verify(token, SECRET_ACCESS_TOKEN) as Record<any, any>;
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch {
    if (!refreshToken) {
      return new Response(null, {
        status: 401,
        headers: {
          'Set-Cookie': 'token=; Max-Age=0; Path=/; HttpOnly',
        },
      });
    }

    const getUserCredentials = await prisma.users.findFirst({
      where: {
        refreshToken,
      },
      select: {
        username: true,
        password: true,
        userid: true,
        refreshToken: true,
      },
    });

    if (!getUserCredentials) {
      return new Response(null, {
        status: 401,
        headers: {
          'Set-Cookie': 'refresh-token=; Max-Age=0; Path=/; HttpOnly',
        },
      });
    }

    const newRefreshToken = randomUUID();

    const { username, userid } = getUserCredentials;
    await prisma.users.update({
      where: {
        userid,
      },
      data: {
        refreshToken: newRefreshToken,
      },
    });
    const newToken = jwt.sign({ username, userid }, SECRET_ACCESS_TOKEN, {
      expiresIn: '90 days',
    });
    const setCookieHeader = [
      `token='${newToken}'; Max-Age=${90 * 24 * 60 * 60}; Path=/; HttpOnly`,

      `refresh-token=${newRefreshToken}; Max-Age=${
        30 * 24 * 60 * 60 * 12
      }; Path=/; HttpOnly`,
    ].join(', ');

    return new Response(null, {
      status: 200,
      headers: {
        'Set-Cookie': setCookieHeader,
      },
    });
  }
};
