import prisma from '$lib/prisma';
import type { PageServerLoad } from '../../$types';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = (async ({ url }: { url: URL }) => {
  const urlProductName = url.searchParams.get('q') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = 12;

  const instock = url.searchParams.get('inStock') === 'true' ? 'true' : 'all';
  const rating = url.searchParams.get('rating') === 'good' ? 'good' : 'all';

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

  if (urlProductName) {
    if (instock === 'true' && rating === 'all') {
      product = await prisma.products.findMany({
        where: {
          instock: true,
          AND: [
            {
              name: {
                contains: urlProductName,
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
                contains: urlProductName,
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
                contains: urlProductName,
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
                contains: urlProductName,
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
                contains: urlProductName,
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
                contains: urlProductName,
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
}) satisfies PageServerLoad;
