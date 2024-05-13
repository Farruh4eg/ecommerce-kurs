import prisma from '$lib/prisma';
import { createErrorResponse } from '$lib/utils/helpers';
import type { UserCookieInfo } from '$lib/utils/interfaces';
import { Prisma, devicetype } from '@prisma/client';
import type { RequestHandler, Server, ServerLoad } from '@sveltejs/kit';
import * as jwt from 'jsonwebtoken';

export const GET: RequestHandler = (async ({ url }: { url: URL }) => {
  const urlQuery = url.searchParams.get('q') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = 12;

  const instock = url.searchParams.get('inStock') === 'true' ? 'true' : 'all';
  const rating = url.searchParams.get('rating') === 'good' ? 'good' : 'all';
  const producttype = url.searchParams.get('type') || '';
  const isDeviceType =
    producttype === devicetype.CABLE ||
    producttype === devicetype.SMARTPHONE ||
    producttype === devicetype.CHARGER ||
    producttype === devicetype.CELLPHONE ||
    producttype === devicetype.TABLET ||
    producttype === devicetype.HEADPHONE ||
    producttype === devicetype.PLAYER ||
    producttype === devicetype.WATCH;

  const suppliers: string[] = [];
  const brandParam = url.searchParams.get('brand') || '';
  if (brandParam) {
    suppliers.push(...brandParam.split('-'));
  }

  const price: number[] = [50, 500_000];
  const priceParam = url.searchParams.get('price');
  if (priceParam) {
    let splittedPrice = priceParam.split('-');
    try {
      price[0] = parseInt(splittedPrice[0]); // min price
      price[1] = parseInt(splittedPrice[1]); // max price
    } catch (e) {
      price[0] = 50;
      price[1] = 500_000;
    }
  }

  let product, totalPages;

  const offset = (page - 1) * pageSize;

  if (!urlQuery) {
    let products;
    let totalPages;

    if (isDeviceType) {
      products = await prisma.products.findMany({
        where: {
          producttype,
        },
        skip: offset,
        take: pageSize,
      });

      totalPages = await prisma.products.count({
        where: {
          producttype,
        },
      });
    } else {
      products = await prisma.products.findMany({
        skip: offset,
        take: pageSize,
      });

      totalPages = await prisma.products.count();
    }

    totalPages = Math.ceil(totalPages / pageSize);

    let response = JSON.stringify(
      { products: products, totalPages: totalPages },
      null,
      2
    );
    return new Response(response, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } else if (isDeviceType && urlQuery) {
    const products = await prisma.products.findMany({
      where: {
        producttype,
        name: {
          contains: urlQuery,
          mode: 'insensitive',
        },
      },
      skip: offset,
      take: pageSize,
    });

    totalPages = await prisma.products.count({
      where: {
        producttype,
        name: {
          contains: urlQuery,
          mode: 'insensitive',
        },
      },
    });

    totalPages = Math.ceil(totalPages / pageSize);

    let response = JSON.stringify(
      { products: products, totalPages: totalPages },
      null,
      2
    );
    return new Response(response, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } else if (urlQuery) {
    if (instock === 'true' && rating === 'all') {
      product = await prisma.products.findMany({
        where: {
          instock: true,
          AND: [
            {
              name: {
                contains: urlQuery,
                mode: 'insensitive',
              },
            },
            {
              suppliers: {
                companyname: {
                  in: suppliers,
                  mode: 'insensitive',
                },
              },
            },
            {
              price: {
                gt: price[0],
              },
            },
            {
              price: {
                lt: price[1],
              },
            },
          ],
        },
        include: {
          ratings: true,
          suppliers: {
            select: {
              companyname: true,
            },
          },
        },
        skip: offset,
        take: pageSize,
      });

      totalPages = await prisma.products.count({
        where: {
          AND: [
            {
              name: {
                contains: urlQuery,
                mode: 'insensitive',
              },
            },
            {
              suppliers: {
                OR: [
                  {
                    companyname: {
                      in: suppliers,
                      mode: 'insensitive',
                    },
                  },
                  {
                    companyname: {
                      contains: suppliers.join(''),
                      mode: 'insensitive',
                    },
                  },
                ],
              },
            },
          ],
        },
      });

      totalPages = Math.ceil(totalPages / pageSize);
    } else if (instock === 'true' && rating === 'good') {
      product = await prisma.products.findMany({
        where: {
          instock: true,
          AND: [
            {
              name: {
                contains: urlQuery,
                mode: 'insensitive',
              },
            },
            {
              suppliers: {
                OR: [
                  {
                    companyname: {
                      in: suppliers,
                      mode: 'insensitive',
                    },
                  },
                  {
                    companyname: {
                      contains: suppliers.join(''),
                      mode: 'insensitive',
                    },
                  },
                ],
              },
            },
            {
              price: {
                gt: price[0],
              },
            },
            {
              price: {
                lt: price[1],
              },
            },
          ],
        },
        include: {
          ratings: true,
          suppliers: {
            select: {
              companyname: true,
            },
          },
        },
        skip: offset,
        take: pageSize,
      });

      totalPages = await prisma.products.count({
        where: {
          AND: [
            {
              name: {
                contains: urlQuery,
                mode: 'insensitive',
              },
            },
            {
              suppliers: {
                OR: [
                  {
                    companyname: {
                      in: suppliers,
                      mode: 'insensitive',
                    },
                  },
                  {
                    companyname: {
                      contains: suppliers.join(''),
                      mode: 'insensitive',
                    },
                  },
                ],
              },
            },
          ],
        },
      });

      totalPages = Math.ceil(totalPages / pageSize);
    } else if (instock === 'all' && rating === 'all') {
      product = await prisma.products.findMany({
        where: {
          AND: [
            {
              name: {
                contains: urlQuery,
                mode: 'insensitive',
              },
            },
            {
              suppliers: {
                OR: [
                  {
                    companyname: {
                      in: suppliers,
                      mode: 'insensitive',
                    },
                  },
                  {
                    companyname: {
                      contains: suppliers.join(''),
                      mode: 'insensitive',
                    },
                  },
                ],
              },
            },
            {
              price: {
                gt: price[0],
              },
            },
            {
              price: {
                lt: price[1],
              },
            },
          ],
        },
        include: {
          ratings: true,
          suppliers: {
            select: {
              companyname: true,
            },
          },
        },
        skip: offset,
        take: pageSize,
      });

      totalPages = await prisma.products.count({
        where: {
          AND: [
            {
              name: {
                contains: urlQuery,
                mode: 'insensitive',
              },
            },
            {
              suppliers: {
                OR: [
                  {
                    companyname: {
                      in: suppliers,
                      mode: 'insensitive',
                    },
                  },
                  {
                    companyname: {
                      contains: suppliers.join(''),
                      mode: 'insensitive',
                    },
                  },
                ],
              },
            },
          ],
        },
      });

      totalPages = Math.ceil(totalPages / pageSize);
    } else if (instock === 'all' && rating === 'good') {
      let productsWithGoodRatings = await prisma.ratings.groupBy({
        by: 'productid',
        having: {
          rating: {
            _avg: {
              gte: 4,
            },
          },
        },
      });

      let productIds: any = productsWithGoodRatings.map((el) => el.productid);

      product = product = await prisma.products.findMany({
        where: {
          productid: {
            in: productIds,
          },
          AND: [
            {
              price: {
                gt: price[0],
              },
            },
            {
              price: {
                lt: price[1],
              },
            },
          ],
        },
        include: {
          ratings: true,
          suppliers: {
            select: {
              companyname: true,
            },
          },
        },
        skip: offset,
        take: pageSize,
      });

      totalPages = await prisma.products.count({
        where: {
          productid: {
            in: productIds,
          },
        },
      });

      totalPages = Math.ceil(totalPages / pageSize);
    }
  }
  product = JSON.stringify(
    { products: product, totalPages: totalPages },
    null,
    2
  );
  return new Response(product, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}) satisfies ServerLoad;

export const PUT: RequestHandler = async ({ request, cookies }) => {
  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const privileges = userInfo?.privileges;
  if (privileges === 'admin' || privileges === 'mod') {
    try {
      let ids: string[] = [];
      const body = await request.json();
      Object.keys(body).forEach((id) => {
        ids.push(id);
      });
      ids.forEach(async (productid) => {
        await prisma.products.update({
          where: {
            productid,
          },
          data: body[productid],
        });
      });
      return new Response(
        JSON.stringify({ success: true, message: 'Product changed' }),
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

export const DELETE: RequestHandler = async ({ url, cookies }) => {
  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const privileges = userInfo?.privileges;
  const queryId = url.searchParams.get('q');

  if ((privileges === 'admin' || privileges === 'mod') && queryId) {
    try {
      await prisma.products.delete({
        where: {
          productid: queryId,
        },
      });

      return new Response(
        JSON.stringify({ success: true, message: 'Product deleted' }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          status: 200,
        }
      );
    } catch (error) {
      return createErrorResponse(`Unknown error: ${error}`, 500);
    }
  }
  return createErrorResponse('Forbidden', 403);
};

export const POST: RequestHandler = async ({ request, cookies }) => {
  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const privileges = userInfo?.privileges;

  if (privileges !== 'admin' && privileges !== 'mod') {
    return createErrorResponse('Forbidden', 403);
  }

  const body = await request.json();

  let productinfo: Record<any, any> = {};
  Object.entries(body).forEach(([key, value]) => {
    if (body[key]) {
      productinfo[key] = value;
    }
  });

  const prismaProductData = productinfo as Prisma.productsCreateInput;
  await prisma.products.create({
    data: prismaProductData,
  });

  return new Response(
    JSON.stringify({ success: true, message: 'Product created successfully' }),
    {
      headers: {
        'Content-Type': 'apllication/json',
      },
      status: 200,
    }
  );
};
