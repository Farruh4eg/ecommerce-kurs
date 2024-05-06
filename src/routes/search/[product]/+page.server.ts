import prisma from '$lib/prisma';
import * as jwt from 'jsonwebtoken';
import type { ServerLoadEvent } from '@sveltejs/kit';
import type { UserCookieInfo } from '$lib/utils/interfaces';
import { fetchProducts } from '$lib/utils/helpers';

export const load = async ({ url, cookies }: ServerLoadEvent) => {
  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const userid = userInfo?.user_id;

  let searchQuery: string = url.searchParams.get('q')!;
  const page = parseInt(url.searchParams.get('page')!);
  const pageSize = 2;

  const products = await fetchProducts(searchQuery, page, pageSize);

  return { products, userid, searchQuery };
};
