import { GetStaticProps, type NextPage } from "next";
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

const SinglePostPage: NextPage<{ username: string }> = ({ username }) => {
    const { data } = api.profile.getUserByUsername.useQuery({ username })

    if (!data) return <div>Not found</div>

    return (
        <>
            <Head>
                <title>{data.user.username}</title>
            </Head>
            <PageLayout>
                <div className="bg-slate-600 h-48 relative">
                    <Image
                        src={data.user.profileImageUrl}
                        alt={data.user.username ?? ''}
                        height={128}
                        width={128}
                        className="rounded-full -mb-[64px] absolute bottom-0 left-4 border-black border-4"
                    />
                </div>
                <div className="h-[64px] spacer"></div>
                <div className="p-4">
                    <span className="text-2xl font-bold">{`@${data.user.username ?? ''}`}</span>
                </div>
                <div className="border-b w-full border-slate-200" />
                <ProfileFeed userId={data.user.id} />
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

    const slug = context.params?.slug
    if (typeof slug !== 'string') throw new Error('Slug is not a string')

    const username = slug.replace("@", '')

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
