import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { LoadingPage } from "~/components/loading";


const SinglePostPage: NextPage = () => {
    const { isSignedIn, isLoaded: userLoaded } = useAuth()

    // Start fetching posts as soon as the page loads
    api.posts.getAll.useQuery()

    if (!userLoaded) return <LoadingPage />

    return (
        <>
            <Head>
                <title>Create T3 App</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main
                className="flex justify-center h-screen">
                <div className="w-full md:max-w-2xl border-x border-slate-400 h-screen">
                    <div className="flex border-b border-slate-400 p-4">
                        Profile view
                    </div>
                </div>
            </main>
        </>
    );
};

export default SinglePostPage;
