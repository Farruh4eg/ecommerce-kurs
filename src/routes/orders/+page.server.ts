import type { UserCookieInfo } from '$lib/utils/interfaces.js';
import * as jwt from 'jsonwebtoken';

export const load = async ({ cookies, fetch }) => {
  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const userid = userInfo?.user_id;
  const response = await fetch(`/v1/user?q=${userid}`);
  let userData = await response.json();
  let userInsensitiveData: any = {
    userid: userData.userid,
    email: userData.email,
    lastname: userData.lastname,
    firstname: userData.firstname,
    country: userData.addresses?.country,
    city: userData.addresses?.city,
    postalcode: userData.addresses?.postalcode,
    address: userData.addresses?.address,
  };

  return { userInsensitiveData };
};
