import prisma from '$lib/prisma';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import { SECRET_ACCESS_TOKEN } from '$env/static/private';
import { dev } from '$app/environment';
import type { RequestHandler } from '@sveltejs/kit';
import type { PostBody } from '$lib/utils/interfaces';
import { createErrorResponse } from '$lib/utils/helpers';
import type { Body } from '$lib/utils/interfaces';

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
      expiresIn: '90 days',
    });

    const setCookieHeader = [
      `token=${token}; Max-Age=${
        90 * 24 * 60 * 60
      }; Path=/; ${secure} HttpOnly`,

      `refresh-token=${refreshToken}; Max-Age=${
        30 * 24 * 60 * 60 * 12
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

export const PUT: RequestHandler = async ({ request }) => {
  const body = (await request.json()) as PostBody;
  let {
    userid,
    lastname,
    firstname,
    birthdate,
    country,
    city,
    postalcode,
    address,
  } = body;

  postalcode = Number(postalcode);

  let isoBirthDate = new Date(birthdate).toISOString();

  const receivedAddressId = await prisma.users.findUnique({
    where: {
      userid,
    },
    select: {
      addressid: true,
    },
  });

  if (receivedAddressId == null) {
    createErrorResponse('No addressid received', 400);
  } else {
    const updateUser = await prisma.users.update({
      where: {
        userid,
      },
      data: {
        lastname,
        firstname,
        birthdate: isoBirthDate,
        addresses: {
          update: {
            where: {
              addressid: receivedAddressId.addressid!,
            },
            data: {
              country,
              city,
              postalcode,
              address,
            },
          },
        },
      },
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: 'user updated successfully',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};
