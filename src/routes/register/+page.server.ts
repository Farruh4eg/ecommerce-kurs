import prisma from '$lib/prisma';
import bcrypt from 'bcrypt'
import type { Actions } from '@sveltejs/kit';

let salt;
let hashedPassword;

export const actions = {
    default: async ({request}) => {
        const data = await request.formData();
        return {
            success: true,
            data
        }
    }
} satisfies Actions;