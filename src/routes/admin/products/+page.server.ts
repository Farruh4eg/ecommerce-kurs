import { error, redirect } from '@sveltejs/kit';
import * as jwt from 'jsonwebtoken';
import type { PageServerLoad } from './$types';
import type { UserCookieInfo } from '$lib/utils/interfaces';

export const load = (async ({ cookies, fetch, url }) => {
  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const privileges = userInfo?.privileges;

  if (privileges !== 'admin' && privileges !== 'mod') {
    error(403, {
      message: 'Forbidden',
    });
  }
}) satisfies PageServerLoad;
