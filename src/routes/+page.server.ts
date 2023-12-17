import prisma from '$lib/prisma';
import * as jwt from 'jsonwebtoken';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
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
