import cookie from 'cookie';
import * as jwt from 'jsonwebtoken';
import { SECRET_ACCESS_TOKEN } from '$env/static/private';
import type { PageServerLoad } from '../$types';

export const load = (async (event) => {
  let token = event.cookies.get('token')?.replaceAll("'", '');
  console.log(token);
  const userInfo = jwt.decode(token);
  const response = await event.fetch(`/v1/user?q=${userInfo.user_id}`);
  let user = await response.json();
  user = JSON.stringify(user, null, 2);

  return {
    user,
  };
}) satisfies PageServerLoad;
