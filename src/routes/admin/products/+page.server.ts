import * as jwt from 'jsonwebtoken';
import type { ServerLoadEvent } from '@sveltejs/kit';
import type { UserCookieInfo } from '$lib/utils/interfaces';
import { fetchProducts } from '$lib/utils/helpers';

export const load = async ({ url, cookies, fetch }: ServerLoadEvent) => {
  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const userid = userInfo?.user_id;

  let searchQuery: string = url.searchParams.get('q') || '';
  const page: number = parseInt(url.searchParams.get('page') ?? '1');

  const products = await fetchProducts(searchQuery, page, fetch);

  return { products, userid, searchQuery };
};
