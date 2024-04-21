import prisma from '$lib/prisma';
import * as jwt from 'jsonwebtoken';
import type { ServerLoadEvent } from '@sveltejs/kit';
import type { UserCookieInfo } from '$lib/utils/interfaces';

export const load = async ({ url, cookies }: ServerLoadEvent) => {
  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const userid = userInfo.user_id;

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

  return { products, userid };
};
