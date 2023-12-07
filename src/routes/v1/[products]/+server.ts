import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const GET = (async ({ url }) => {
  const urlProductId = url.searchParams.get('q');
  const urlProductName = url.searchParams.get('name');
  let product;
  if (urlProductName) {
    product = await prisma.products.findMany({
      where: {
        name: {
          contains: urlProductName,
          mode: 'insensitive',
        },
      },
    });
  } else if (urlProductId == 'all') {
    product = await prisma.products.findMany({});
  } else {
    product = await prisma.products.findUnique({
      where: {
        productid: urlProductId,
      },
      include: {
        suppliers: true,
        ratings: true,
        wishlistitems: true,
      },
    });
  }
  product = JSON.stringify(product, null, 2);
  return new Response(product);
}) satisfies PageServerLoad;
