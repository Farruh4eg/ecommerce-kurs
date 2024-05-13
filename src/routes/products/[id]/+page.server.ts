import prisma from '$lib/prisma';
import type { UserCookieInfo } from '$lib/utils/interfaces';
import * as jwt from 'jsonwebtoken';

export const load = async ({ params: { id }, cookies }) => {
  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const userid = userInfo?.user_id;

  const product = await prisma.products.findUnique({
    where: { productid: id },
    include: {
      ratings: {
        select: {
          rating: true,
        },
      },
      suppliers: {
        select: {
          supplierid: true,
          logo: true,
          companyname: true,
        },
      },
    },
  });

  return { product, userid };
};
