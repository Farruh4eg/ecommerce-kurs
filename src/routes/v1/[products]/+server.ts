import prisma from '$lib/prisma';
import type { PageServerLoad } from '../../$types';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = (async ({ url }: { url: URL }) => {
  const urlProductId = url.searchParams.get('q');
  const urlProductName = url.searchParams.get('name');
  const page = parseInt(url.searchParams.get('page')!);
  const pageSize = 2;
  let product;

  const offset = (page - 1) * pageSize;

  if (urlProductName) {
    product = await prisma.products.findMany({
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
      include: {
        ratings: true,
      },
      skip: offset,
      take: pageSize,
    });
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
  product = JSON.stringify([product], null, 2);
  return new Response(product, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}) satisfies PageServerLoad;
