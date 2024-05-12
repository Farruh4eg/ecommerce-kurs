import prisma from '$lib/prisma';
import * as jwt from 'jsonwebtoken';
import type { UserCookieInfo } from '$lib/utils/interfaces';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load = (async ({ cookies }) => {
  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const userid = userInfo?.user_id;

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

  const user = await prisma.users.findUnique({
    where: {
      userid,
    },
  });

  let userDataFilled = true;

  if (
    user?.addressid == null ||
    user.birthdate == null ||
    user.email == null ||
    user.firstname == null ||
    user.lastname == null
  ) {
    userDataFilled = false;
  }

  return { products, userid, userDataFilled, user };
}) satisfies PageServerLoad;
