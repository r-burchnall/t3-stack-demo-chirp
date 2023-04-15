import { GetStaticProps, type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";

const SinglePostPage: NextPage<{ username: string }> = ({ username }) => {
    const { data } = api.profile.getUserByUsername.useQuery({ username })

    if (!data) return <div>Not found</div>

    return (
        <>
            <Head>
                <title>{data.user.username}</title>
            </Head>
            <PageLayout>
                {data.user.username}
            </PageLayout>
        </>
    );
};

import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from "~/server/api/root";
import SuperJSON from "superjson";
import { prisma } from "~/server/db";
import { PageLayout } from "~/components/layout";


export const getStaticProps: GetStaticProps = async (context) => {
    const ssg = createServerSideHelpers({
        router: appRouter,
        ctx: { prisma, userId: null },
        transformer: SuperJSON
    });

    let slug = context.params?.slug
    if (typeof slug !== 'string') throw new Error('Slug is not a string')

    let username = slug.replace("@", '')

    await ssg.profile.getUserByUsername.prefetch({
        username
    })

    return {
        props: {
            trpcState: ssg.dehydrate(),
            username
        }
    }
}

export const getStaticPaths = () => {
    return {
        paths: [], fallback: 'blocking'
    }
}

export default SinglePostPage;
