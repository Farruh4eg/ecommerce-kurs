import prisma from '$lib/prisma';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import { SECRET_ACCESS_TOKEN } from '$env/static/private';
import { dev } from '$app/environment';
import type { RequestHandler } from '@sveltejs/kit';

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

  if (body.username.length < 4 || body.password.length < 8) {
    return createErrorResponse(
      'Логин должен быть больше 4 символов. Пароль должен быть больше 8 символов',
      400
    );
  } else {
    const check_user = await prisma.users.findFirst({
      where: {
        username: body.username,
      },
      select: {
        username: true,
      },
    });
    if (check_user) {
      return createErrorResponse('Пользователь уже существует', 409);
    }
    const saltRounds = 14;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);
    const refreshToken = randomUUID();

    const create_user = await prisma.users.create({
      data: {
        username: body.username,
        refreshToken,
        password: hashedPassword,
      },
    });

    const user_id = create_user.userid;

    const user = {
      username: body.username,
      user_id,
    };
    const secure = dev ? '' : 'Secure;';
    const token = jwt.sign(user, SECRET_ACCESS_TOKEN, {
      expiresIn: `${15 * 60 * 1000}`,
    });

    const setCookieHeader = [
      `token=${token}; Max-Age=${15 * 60}; Path=/; ${secure} HttpOnly`,

      `refresh-token=${refreshToken}; Max-Age=${
        30 * 24 * 60 * 60
      }; Path=/; ${secure} HttpOnly`,
    ].join(', ');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': setCookieHeader,
      },
    });
  }
};
