import prisma from '$lib/prisma';
import jwt from 'jsonwebtoken';
import type { RequestHandler } from '@sveltejs/kit';
import type { UserCookieInfo } from '$lib/utils/interfaces';
import { createErrorResponse } from '$lib/utils/helpers';

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
        _count: {
          select: {
            products: true,
          },
        },
        companyname: true,
        address: true,
        city: true,
        country: true,
        email: true,
        logo: true,
        phone: true,
        postalcode: true,
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
        _count: {
          select: {
            products: true,
          },
        },
        companyname: true,
        address: true,
        city: true,
        country: true,
        email: true,
        logo: true,
        phone: true,
        postalcode: true,
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
      _count: {
        select: {
          products: true,
        },
      },
      companyname: true,
      address: true,
      city: true,
      country: true,
      email: true,
      logo: true,
      phone: true,
      postalcode: true,
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
