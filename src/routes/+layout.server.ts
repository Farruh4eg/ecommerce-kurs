import * as jwt from 'jsonwebtoken';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
  let token = event.cookies.get('token')?.replaceAll("'", '');
  const userInfo = jwt.decode(token);
  return { userInfo };
}) satisfies PageServerLoad;
