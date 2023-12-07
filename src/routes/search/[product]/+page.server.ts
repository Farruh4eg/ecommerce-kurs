import prisma from '$lib/prisma';
import type { PageServerLoad } from '../$types';

export const load = (async ({ url }) => {
  let searchQuery: any = url.searchParams.get('q');
  const products = await prisma.products.findMany({
    where: {
      OR: [
        {
          name: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
        {
          color: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
        {
          cpumodel: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
        {
          os: {
            equals: searchQuery,
            mode: 'insensitive',
          },
        },
        {
          osversion: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
        {
          batterytype: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
      ],
    },
    include: {
      ratings: true,
    },
  });

  return { products };
}) satisfies PageServerLoad;
