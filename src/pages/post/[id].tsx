import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { LoadingPage } from "~/components/loading";
import { PageLayout } from "~/components/layout";


const SinglePostPage: NextPage = () => {
    const { isSignedIn, isLoaded: userLoaded } = useAuth()

    // Start fetching posts as soon as the page loads
    api.posts.getAll.useQuery()

    if (!userLoaded) return <LoadingPage />

    return (
        <>
            <Head>
                <title>Post</title>
            </Head>
            <PageLayout>
                post page
            </PageLayout>
        </>
    );
};

export default SinglePostPage;
