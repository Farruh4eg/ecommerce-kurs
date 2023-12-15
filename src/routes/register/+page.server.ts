import prisma from "$lib/prisma";
import bcrypt from "bcrypt";
import type { Actions } from "@sveltejs/kit";

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const username = String(data.get("username"));
    const password = String(data.get("password"));
    const res = {
      success: false,
      errorMessage: "",
    };

    const getUsername = await prisma.users.findFirst({
      where: {
        username,
      },
    });

    if (getUsername !== null) {
      res.errorMessage = "Имя пользователя занято";
    } else {
      const saltRounds = 14;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      await prisma.users.create({
        data: {
          username,
          password: hashedPassword,
        },
      });
      res.success = true;
    }
    return res;
  },
} satisfies Actions;
