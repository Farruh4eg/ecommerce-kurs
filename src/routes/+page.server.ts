import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
  const products = await prisma.products.findMany({});
  return { products };
}) satisfies PageServerLoad;
