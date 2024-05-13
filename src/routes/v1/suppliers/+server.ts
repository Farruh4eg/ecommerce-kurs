import prisma from '$lib/prisma';
import jwt from 'jsonwebtoken';
import type { RequestHandler } from '@sveltejs/kit';
import type { UserCookieInfo } from '$lib/utils/interfaces';
import { createErrorResponse } from '$lib/utils/helpers';
import { devicetype } from '@prisma/client';

const devicetypes = [
  devicetype.CABLE,
  devicetype.CELLPHONE,
  devicetype.CHARGER,
  devicetype.HEADPHONE,
  devicetype.PLAYER,
  devicetype.SMARTPHONE,
  devicetype.TABLET,
  devicetype.WATCH,
];

export const GET: RequestHandler = async ({ url, cookies }) => {
  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const privileges = userInfo?.privileges;
  const urlSupplierId = parseInt(url.searchParams.get('q') || '-1');
  const searchQuery = url.searchParams.get('search');
  const page = parseInt(url.searchParams.get('page') || '1');
  const sendTotalPages = url.searchParams.get('total') === 'true';
  const pageSize = 12;
  const offset = (page - 1) * pageSize;
  const isPermitted = privileges === 'admin' || privileges === 'mod';

  if (sendTotalPages && searchQuery) {
    let totalPages = await prisma.suppliers.count({
      where: {
        OR: [
          {
            companyname: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            country: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            phone: {
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
    const suppliers = await prisma.suppliers.findMany({
      where: {
        OR: [
          {
            companyname: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            country: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            city: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            phone: {
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
        ],
      },
      select: {
        companyname: true,
        supplierid: true,
        address: true,
        city: true,
        country: true,
        email: true,
        logo: true,
        phone: true,
        postalcode: true,
        producttype: true,
      },
      skip: offset,
      take: pageSize,
    });

    return new Response(JSON.stringify(suppliers), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  if (isPermitted && urlSupplierId === -1) {
    let suppliers = await prisma.suppliers.findMany({
      select: {
        companyname: true,
        supplierid: true,
        address: true,
        city: true,
        country: true,
        email: true,
        logo: true,
        phone: true,
        postalcode: true,
        producttype: true,
      },
      skip: offset,
      take: pageSize,
    });

    return new Response(JSON.stringify(suppliers), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  let supplier = await prisma.suppliers.findUnique({
    where: {
      supplierid: urlSupplierId,
    },
    select: {
      companyname: true,
      supplierid: true,
      address: true,
      city: true,
      country: true,
      email: true,
      logo: true,
      phone: true,
      postalcode: true,
      producttype: true,
    },
  });

  const userJson = JSON.stringify(supplier, null, 2);

  return new Response(userJson, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const DELETE: RequestHandler = async ({ url, cookies }) => {
  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const privilege = userInfo?.privileges;
  const queryId = parseInt(url.searchParams.get('q') || '');

  if ((privilege === 'admin' || privilege === 'mod') && queryId) {
    await prisma.suppliers.delete({
      where: {
        supplierid: queryId,
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

export const PUT: RequestHandler = async ({ request, cookies }) => {
  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const privileges = userInfo?.privileges;
  if (privileges === 'admin' || privileges === 'mod') {
    try {
      let ids: number[] = [];
      const body = await request.json();
      Object.keys(body).forEach((id) => {
        ids.push(parseInt(id));
      });
      ids.forEach(async (supplierid) => {
        let producttypeVar: devicetype[];
        if (body[supplierid].postalcode) {
          body[supplierid].postalcode = parseInt(body[supplierid].postalcode);
        }
        if (body[supplierid].producttype) {
          producttypeVar = body[supplierid].producttype;
          body[supplierid].producttype = [producttypeVar];
        }

        await prisma.suppliers.update({
          where: {
            supplierid,
          },
          data: body[supplierid],
        });
      });
      return new Response(
        JSON.stringify({ success: true, message: 'Supplier changed' }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          status: 200,
        }
      );
    } catch (error) {
      return createErrorResponse(`Unknown error`, 500);
    }
  }
  return createErrorResponse('Forbidden', 403);
};

export const POST: RequestHandler = async ({ request, cookies }) => {
  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const privileges = userInfo?.privileges;

  if (privileges === 'admin' || privileges === 'mod') {
    let producttypeVar: devicetype[];

    const body = await request.json();

    producttypeVar = body.producttype;

    body.producttype = [producttypeVar];

    await prisma.suppliers.create({
      data: body,
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Supplier created' }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  }
  return createErrorResponse('Forbidden', 403);
};
