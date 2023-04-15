import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import Image from 'next/image'

import { api } from "~/utils/api";

const ProfileFeed = (props: {userId: string}) => {
    const { data, isLoading } = api.posts.getPostsForUserId.useQuery({ userId: props.userId })

    if (isLoading) return <LoadingPage />

    if (!data || data.length === 0) return <div>User has not posted</div>

    return (
        <div className="flex flex-col">
            {data.map((fullPost) => (
                <PostView {...fullPost} key={fullPost.post.id} />
            ))}
        </div>
    )
}

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
import { LoadingPage } from "~/components/loading";
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
