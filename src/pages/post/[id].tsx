import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
    const { data } = api.posts.getById.useQuery({ id })

    if (!data) return <div>Not found</div>

    return (
        <>
            <Head>
                <title>{`${data.post.content} - ${data.author.username}`}</title>
            </Head>
            <PageLayout>
                <PostView {...data} />
            </PageLayout>
        </>
    );
};

import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/PostView";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";


export const getStaticProps: GetStaticProps = async (context) => {
    const ssg = generateSSGHelper();

    const id = context.params?.id

    if (typeof id !== 'string') throw new Error('Invalid id')

    await ssg.posts.getById.prefetch({ id })

    return {
        props: {
            trpcState: ssg.dehydrate(),
            id
        }
    }
}

export const getStaticPaths = () => {
    return {
        paths: [], fallback: 'blocking'
    }
}

export default SinglePostPage;
