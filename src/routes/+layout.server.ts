import type { ServerLoad, ServerLoadEvent } from '@sveltejs/kit';
import * as jwt from 'jsonwebtoken';
import type { PageServerLoad } from './$types';
import type { UserCookieInfo } from '$lib/utils/interfaces';
import prisma from '$lib/prisma';

export const load: ServerLoad = (async (event: ServerLoadEvent) => {
  let token = event.cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;

  let wishlistCount = 0;

  if (userInfo?.user_id) {
    wishlistCount = await prisma.wishlists.count({
      where: {
        userid: userInfo.user_id,
      },
    });
  }
  return { userInfo, wishlistCount };
}) satisfies PageServerLoad;
