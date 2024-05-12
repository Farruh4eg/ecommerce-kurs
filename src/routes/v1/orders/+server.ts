import prisma from '$lib/prisma';
import * as jwt from 'jsonwebtoken';
import { createErrorResponse } from '$lib/utils/helpers';
import type { RequestHandler } from '@sveltejs/kit';
import type { UserCookieInfo } from '$lib/utils/interfaces';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const body = (await request.json()) as {
    userid: string;
    bodyProducts: Record<string, number>;
    user: UserCookieInfo;
  };

  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const cookieUserId = userInfo?.user_id;

  const { userid, bodyProducts, user } = body;

  let productIds = Object.keys(bodyProducts);

  if (cookieUserId != userid) {
    return createErrorResponse(`Forbidden`, 403);
  }

  const products = await prisma.products.findMany({
    where: {
      productid: {
        in: productIds,
      },
    },
    select: {
      price: true,
      productid: true,
    },
  });

  let product_price: Record<string, number> = {};

  products.forEach((el) => {
    product_price[el.productid] = el.price;
  });

  const order = await prisma.orders.create({
    data: {
      deleted: false,
      fulfilled: false,
      userid,
    },
  });

  productIds.forEach(async (productid) => {
    await prisma.orderdetails.create({
      data: {
        orderid: order.orderid,
        productid,
        price: product_price[productid],
        quantity: bodyProducts[productid],
      },
    });
  });

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Order created successfully',
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    }
  );
};

export const GET: RequestHandler = async ({ url }) => {
  const userid = url.searchParams.get('q');

  if (userid) {
    const orders = await prisma.orders.findMany({
      where: {
        userid,
      },
      include: {
        orderdetails: {
          select: {
            products: {
              select: {
                photo: true,
                name: true,
                producttype: true,
                releaseyear: true,
                color: true,
                productid: true,
              },
            },
            price: true,
            quantity: true,
            total: true,
          },
        },
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: orders,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  }

  return createErrorResponse('User not found', 404);
};
