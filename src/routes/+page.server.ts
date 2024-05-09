import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
  const products = await prisma.products.findMany({
    include: {
      ratings: {
        select: {
          rating: true,
        },
      },
    },
  });
  return { products };
}) satisfies PageServerLoad;
