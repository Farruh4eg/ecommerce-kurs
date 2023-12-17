import * as jwt from 'jsonwebtoken';
import type { PageServerLoad } from '../$types';

export const load = (async (event) => {
  let token = event.cookies.get('token')?.replaceAll("'", '');
  const userInfo = jwt.decode(token);
  const response = await event.fetch(`/v1/user?q=${userInfo?.user_id}`);
  let userData = await response.json();
  let userInsensitiveData: any = {
    userid: userData.userid,
    username: userData.username,
    privileges: userData.privileges,
    email: userData.email,
    lastname: userData.lastname,
    firstname: userData.firstname,
    birthdate: userData.birthdate.split('T')[0],
    country: userData.addresses.country,
    city: userData.addresses.city,
    postalcode: userData.addresses.postalcode,
    address: userData.addresses.address,
  };

  userInsensitiveData = JSON.stringify(userInsensitiveData, null, 2);

  return {
    userInsensitiveData,
  };
}) satisfies PageServerLoad;
