import * as jwt from 'jsonwebtoken';
import type { UserCookieInfo } from '$lib/utils/interfaces';
import type { PageServerLoad, PageServerLoadEvent } from './$types';
import { error } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const load = (async ({ cookies, fetch, url }) => {
  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const privileges = userInfo?.privileges;
  const userid = userInfo?.user_id;

  if (privileges !== 'admin' && privileges !== 'mod') {
    error(403, {
      message: 'Forbidden',
    });
  }

  const page: number = parseInt(url.searchParams.get('page') ?? '1');
  const pageSize = 12;

  const response = await fetch(`/v1/user?q=all&page=${page}`, {
    method: 'GET',
  });
  const users = await response.json();

  let totalPages = await prisma.users.count();

  totalPages = Math.ceil(totalPages / pageSize);

  return { users, totalPages, privileges, userid };
}) satisfies PageServerLoad;
