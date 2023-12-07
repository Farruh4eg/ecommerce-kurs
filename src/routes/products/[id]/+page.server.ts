import prisma from "$lib/prisma";
import type { PageServerLoad } from './$types';

export const load = (async ({ params: { id } }) => {
    const product = await prisma.products.findUnique({
        where: { productid: id },
    });
    return { product };
}) satisfies PageServerLoad;
