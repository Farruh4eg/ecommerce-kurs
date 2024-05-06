import prisma from '$lib/prisma';
import * as jwt from 'jsonwebtoken';
import type { ServerLoadEvent } from '@sveltejs/kit';
import type { UserCookieInfo } from '$lib/utils/interfaces';

export const load = async ({ cookies }: ServerLoadEvent) => {
  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const userid = userInfo.user_id;

  const products = await prisma.carts.findMany({
    where: {
      userid,
    },
    include: {
      products: {
        include: {
          ratings: true,
        },
      },
    },
  });

  return { products, userid };
};
