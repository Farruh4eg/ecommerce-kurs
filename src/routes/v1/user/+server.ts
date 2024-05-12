import prisma from '$lib/prisma';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import { SECRET_ACCESS_TOKEN } from '$env/static/private';
import { dev } from '$app/environment';
import type { RequestHandler } from '@sveltejs/kit';
import type { PostBody, UserCookieInfo } from '$lib/utils/interfaces';
import { createErrorResponse } from '$lib/utils/helpers';
import type { Body } from '$lib/utils/interfaces';

export const GET: RequestHandler = async ({ url, cookies }) => {
  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const privileges = userInfo?.privileges;
  const urlUserId = url.searchParams.get('q');
  const searchQuery = url.searchParams.get('search');
  const page = parseInt(url.searchParams.get('page') || '1');
  const sendTotalPages = url.searchParams.get('total') === 'true';
  const pageSize = 12;
  const offset = (page - 1) * pageSize;
  const isPermitted = privileges === 'admin' || privileges === 'mod';

  if (sendTotalPages && searchQuery) {
    let totalPages = await prisma.users.count({
      where: {
        OR: [
          {
            username: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            firstname: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            lastname: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            privileges: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    totalPages = Math.ceil(totalPages / pageSize);

    return new Response(JSON.stringify(totalPages), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } else if (isPermitted && searchQuery) {
    const users = await prisma.users.findMany({
      where: {
        OR: [
          {
            username: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            firstname: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            lastname: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            privileges: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        userid: true,
        username: true,
        firstname: true,
        lastname: true,
        email: true,
        privileges: true,
        datecreated: true,
      },
      skip: offset,
      take: pageSize,
    });

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  if (isPermitted && urlUserId === 'all') {
    let users = await prisma.users.findMany({
      select: {
        userid: true,
        username: true,
        firstname: true,
        lastname: true,
        email: true,
        privileges: true,
        datecreated: true,
      },
      skip: offset,
      take: pageSize,
    });

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

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
      privileges: create_user.privileges,
    };
    const secure = dev ? '' : 'Secure';
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

export const PUT: RequestHandler = async ({ request, url }) => {
  const privilege = url.searchParams.get('privilege');
  const changingUserId = url.searchParams.get('userid');

  if (privilege && changingUserId) {
    const user = await prisma.users.update({
      where: {
        userid: changingUserId,
      },
      data: {
        privileges: privilege,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'User privilige changed',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } else {
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
      email,
    } = body;

    postalcode = Number(postalcode);

    let isoBirthDate = new Date(birthdate).toISOString();

    const existingAddress = await prisma.addresses.findFirst({
      where: {
        country,
        city,
        postalcode,
        address,
      },
    });

    let addressId;

    if (existingAddress) {
      addressId = existingAddress.addressid;
    } else {
      const createdAddress = await prisma.addresses.create({
        data: {
          country,
          city,
          postalcode,
          address,
        },
      });
      addressId = createdAddress.addressid;
    }

    const receivedUser = await prisma.users.findUnique({
      where: {
        userid,
      },
    });

    if (!receivedUser) {
      createErrorResponse('Пользователь не найден', 404);
    } else {
      await prisma.users.update({
        where: {
          userid,
        },
        data: {
          lastname,
          firstname,
          birthdate: isoBirthDate,
          addressid: addressId,
          email,
        },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Пользователь создан успешно',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

export const DELETE: RequestHandler = async ({ request, url, cookies }) => {
  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const privilege = userInfo?.privileges;
  const queryId = url.searchParams.get('q');

  if (privilege === 'admin' && queryId) {
    await prisma.users.delete({
      where: {
        userid: queryId,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'User deleted successfully',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  return createErrorResponse('Forbidden', 403);
};
