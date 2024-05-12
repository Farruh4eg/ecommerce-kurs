import type { UserCookieInfo } from '$lib/utils/interfaces.js';
import * as jwt from 'jsonwebtoken';

export const load = async ({ cookies }) => {
  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const userid = userInfo?.user_id;

  return { userid };
};
