import prisma from "$lib/prisma";
import bcrypt from "bcrypt";
import type { Actions } from "@sveltejs/kit";
import { login } from "$lib/session";

export const actions: Actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();
    const username = String(data.get("username"));
    const password = String(data.get("password"));

    const getUserCredentials = await prisma.users.findFirst({
      where: {
        username,
      },
      select: {
        password: true,
      },
    });

    console.log(getUserCredentials);

    if (getUserCredentials) {
      const isSame = await bcrypt.compare(
        password,
        getUserCredentials.password
      );

      if (isSame) {
        login();
        return {
          status: 200,
          body: JSON.stringify({
            success: true,
          }),
        };
      }
    } else {
      return {
        status: 401,
        body: JSON.stringify({
          success: false,
          message: "Неверные данные",
        }),
      };
    }
  },
};
