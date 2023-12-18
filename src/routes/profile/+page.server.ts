import type { ServerLoadEvent } from "@sveltejs/kit";
import * as jwt from "jsonwebtoken";
import type { PageServerLoad } from "../$types";

export const load = (async (event: ServerLoadEvent) => {
  let token = event.cookies.get("token")?.replaceAll("'", "") as string;
  const userInfo = jwt.decode(token) as Record<any, any>;
  const response = await event.fetch(`/v1/user?q=${userInfo?.user_id}`);
  let userData = await response.json();
  let userInsensitiveData: any = {
    userid: userData.userid,
    username: userData.username,
    privileges: userData.privileges,
    email: userData.email,
    lastname: userData.lastname,
    firstname: userData.firstname,
    birthdate: userData.birthdate?.split("T")[0],
    country: userData.addresses?.country,
    city: userData.addresses?.city,
    postalcode: userData.addresses?.postalcode,
    address: userData.addresses?.address,
  };

  userInsensitiveData = JSON.stringify(userInsensitiveData, null, 2);

  return {
    userInsensitiveData,
  };
}) satisfies PageServerLoad;
