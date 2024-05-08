import prisma from '$lib/prisma';
import type { PageServerLoad } from '../../$types';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = (async ({ url }: { url: URL }) => {
  const urlProductId = url.searchParams.get('q') || '';
  const urlProductName = url.searchParams.get('name') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  const instock: boolean = url.searchParams.get('inStock') === 'true' || true;

  const suppliers: string[] = [];
  const brandParam = url.searchParams.get('brand');
  if (brandParam) {
    suppliers.push(...brandParam.split('-'));
  }
  suppliers.push(urlProductId);

  const price: number[] = [0, 500_000];
  const priceParam = url.searchParams.get('price');
  if (priceParam) {
    let splittedPrice = priceParam.split('-');
    try {
      price[0] = parseInt(splittedPrice[0]);
      price[1] = parseInt(splittedPrice[1]);
    } catch (e) {
      price[0] = 0;
      price[1] = 500_000;
    }
  }

  const pageSize = 12;

  let product, totalPages;

  const offset = (page - 1) * pageSize;

  if (urlProductName) {
    product = await prisma.products.findMany({
      where: {
        instock,
        OR: [
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
        ],
        AND: [
          {
            price: {
              gt: price[0],
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
        OR: [
          {
            name: {
              contains: urlProductName,
              mode: 'insensitive',
            },
          },
          {
            suppliers: {
              companyname: {
                contains: urlProductName,
                mode: 'insensitive',
              },
            },
          },
        ],
      },
    });

    totalPages = Math.ceil(totalPages / pageSize);
  } else if (urlProductId == 'all') {
    product = await prisma.products.findMany({
      skip: offset,
      take: pageSize,
    });
  } else {
    product = await prisma.products.findUnique({
      where: {
        productid: urlProductId!,
      },
      include: {
        suppliers: true,
        ratings: true,
      },
    });
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
