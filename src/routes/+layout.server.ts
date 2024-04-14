import type { ServerLoad, ServerLoadEvent } from '@sveltejs/kit';
import * as jwt from 'jsonwebtoken';
import type { PageServerLoad } from './$types';
import type { UserCookieInfo } from '$lib/utils/interfaces';

export const load: ServerLoad = (async (event: ServerLoadEvent) => {
  let token = event.cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  return { userInfo };
}) satisfies PageServerLoad;
