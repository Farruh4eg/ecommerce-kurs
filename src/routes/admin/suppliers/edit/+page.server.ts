import * as jwt from 'jsonwebtoken';
import type { UserCookieInfo } from '$lib/utils/interfaces';
import type { PageServerLoad, PageServerLoadEvent } from './$types';
import { error } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const load = (async ({ cookies, fetch, url }) => {
  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const privileges = userInfo?.privileges;

  if (privileges !== 'admin' && privileges !== 'mod') {
    throw new Error('Forbidden');
  }

  const page: number = parseInt(url.searchParams.get('page') ?? '1');
  const pageSize = 12;

  const response = await fetch(`/v1/suppliers?q=-1&page=${page}`, {
    method: 'GET',
  });
  const suppliers = await response.json();

  let totalPages = await prisma.suppliers.count();

  totalPages = Math.ceil(totalPages / pageSize);

  return { suppliers, totalPages };
}) satisfies PageServerLoad;
