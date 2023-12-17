import prisma from '$lib/prisma';
import bcrypt from 'bcrypt';
import type { RequestHandler } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { SECRET_ACCESS_TOKEN } from '$env/static/private';
import { dev } from '$app/environment';

interface Body {
  username: string;
  password: string;
}

function createErrorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ success: false, message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: RequestHandler = async ({ request }) => {
  const body = (await request.json()) as Body;
  const username = body.username;
  const password = body.password;

  const getUserCredentials = await prisma.users.findFirst({
    where: {
      username,
    },
    select: {
      username: true,
      password: true,
      userid: true,
      refreshToken: true,
    },
  });

  if (getUserCredentials) {
    const isSame = await bcrypt.compare(password, getUserCredentials.password);
    if (isSame) {
      const refreshToken = getUserCredentials.refreshToken;

      const user = {
        username: getUserCredentials.username,
        user_id: getUserCredentials.userid,
      };
      const secure = dev ? '' : 'Secure;';

      const token = jwt.sign(user, SECRET_ACCESS_TOKEN, {
        expiresIn: '90 days',
      });

      const setCookieHeader = [
        `token='${token}'; Max-Age=${
          90 * 24 * 60 * 60
        }; Path=/; ${secure} HttpOnly`,

        `refresh-token=${refreshToken}; Max-Age=${
          30 * 24 * 60 * 60 * 12
        }; Path=/; ${secure} HttpOnly`,
      ].join(', ');

      return new Response(null, {
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': setCookieHeader,
        },
      });
    } else {
      return createErrorResponse('Неверный пароль', 401);
    }
  } else {
    return createErrorResponse('Пользователь не найден', 404);
  }
};
