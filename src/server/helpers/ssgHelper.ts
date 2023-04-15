import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from "~/server/api/root";
import SuperJSON from "superjson";
import { prisma } from "~/server/db";


export const generateSSGHelper = () => {
    return createServerSideHelpers({
        router: appRouter,
        ctx: { prisma, userId: null },
        transformer: SuperJSON
    });
}