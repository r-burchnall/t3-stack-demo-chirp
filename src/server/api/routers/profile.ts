

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { filterUsersForClient } from "~/server/helpers/filterUsersForClient";

export const profileRouter = createTRPCRouter({
    getUserByUsername: publicProcedure.input(
        z.object({
            username: z.string(),
        })
    ).query(async ({ input }) => {
        const user = await clerkClient.users.getUserList({
            username: [input.username]
        })

        if (!user[0]) {
            throw new TRPCError({ message: 'User not found', code: 'NOT_FOUND' })
        }

        return { 
            user: filterUsersForClient(user[0]),
        };
    })
});
