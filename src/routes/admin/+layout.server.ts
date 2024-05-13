import prisma from '$lib/prisma';
import * as jwt from 'jsonwebtoken';
import type { UserCookieInfo } from '$lib/utils/interfaces';
import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const privileges = userInfo?.privileges;

  if (privileges !== 'admin' && privileges !== 'mod') {
    throw redirect(307, '/');
  }
};
