import type { ServerLoad, ServerLoadEvent } from "@sveltejs/kit";
import * as jwt from "jsonwebtoken";
import type { PageServerLoad } from "./$types";

export const load: ServerLoad = (async (event: ServerLoadEvent) => {
  let token = event.cookies.get("token")?.replaceAll("'", "") as string;
  const userInfo = jwt.decode(token) as Record<any, any>;
  return { userInfo };
}) satisfies PageServerLoad;
