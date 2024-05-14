import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
  const products = await prisma.products.findMany({
    orderBy: {
      dateCreated: 'desc',
    },

    include: {
      ratings: {
        select: {
          rating: true,
        },
      },
      suppliers: {
        select: {
          companyname: true,
        },
      },
    },

    take: 4,
  });

  const suppliers = await prisma.suppliers.findMany({
    select: {
      companyname: true,
      logo: true,
    },
    take: 12,
  });

  return { products, suppliers };
}) satisfies PageServerLoad;
