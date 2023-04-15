import type { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import type { Post } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { filterUsersForClient } from "~/server/helpers/filterUsersForClient";

const addUserDataToPosts = async (posts: Post[]) => {
    const users = (await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
        limit: 100,
    }))
        .map(filterUsersForClient);

    return posts.map((post) => {
        const author = users.find((user) => user.id === post.authorId)
        if (!author || !author.username) {
            throw new TRPCError({ message: 'Author not found', code: 'INTERNAL_SERVER_ERROR' })
        }

        return {
            post,
            author: {
                ...author,
                username: author.username
            },
        }
    });

}


// Will allow 3 requests per minute
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(3, "1 m"),
    analytics: true,
    /**
     * Optional prefix for the keys used in redis. This is useful if you want to share a redis
     * instance with other applications and want to avoid key collisions. The default prefix is
     * "@upstash/ratelimit"
     */
    prefix: "@upstash/ratelimit",
});

export const postsRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        const posts = await ctx.prisma.post.findMany({
            take: 100,
            orderBy: {
                createdAt: "desc",
            },
        });

        const fullPosts = await addUserDataToPosts(posts)
        return fullPosts
    }),

    getPostsForUserId: publicProcedure.input(
        z.object({
            userId: z.string(),
        })
    )
        .query(async ({ ctx, input }) => {
            const posts = await ctx.prisma.post.findMany({
                where: {
                    authorId: input.userId,
                },
                take: 100,
                orderBy: {
                    createdAt: "desc",
                },
            })

            return await addUserDataToPosts(posts)
        }),

    create: privateProcedure.input(z.object({
        content: z.string().emoji("Only emojis are allowed!").min(1).max(150),
    })).mutation(async ({ ctx, input }) => {
        const authorId = ctx.userId;

        const { success } = await ratelimit.limit(authorId);
        if (!success) {
            throw new TRPCError({
                message: "You are posting too fast",
                code: "TOO_MANY_REQUESTS",
            });
        }

        const { content } = input;
        const post = await ctx.prisma.post.create({
            data: {
                content,
                authorId,
            }
        });

        return post
    })
});
