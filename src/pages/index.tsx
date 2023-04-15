import { type NextPage } from "next";
import { api } from "~/utils/api";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/PostView";


const CreatePostWizard = () => {
    const { user, } = useUser()
    const [input, setInput] = useState('')

    const ctx = api.useContext();
    const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
        onSuccess: () => {
            setInput('')
            void ctx.posts.invalidate()
        },
        onError: (e) => {
            const errorMessage = e.data?.zodError?.fieldErrors.content;
            if (!errorMessage || !errorMessage[0]) return;

            toast.error(`Failed to post: ${errorMessage[0]}`, {
                position: "bottom-center"
            })
        }
    })

    if (!user) return null

    return (
        <div className="flex gap-3 w-full">
            <Image
                height={56}
                width={56}
                className="h-14 w-14 rounded-full"
                src={user.profileImageUrl}
                alt={user.username!} />
            <input
                type="text"
                placeholder="Type some emojis!"
                className="bg-transparent grow outline-none disabled:opacity-50"
                value={input}
                disabled={isPosting}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault()
                        mutate({ content: input })
                    }
                }}
                onChange={(e) => setInput(e.currentTarget.value)} />
            {input !== "" && !isPosting && <button
                onClick={() => {
                    mutate({ content: input })
                }}>
                Post
            </button>}
            {isPosting && (
                <div className="flex justify-center items-center">
                    <LoadingSpinner size={20} />
                </div>
            )}
        </div>
    )
}

const Feed = () => {
    const { data, isLoading } = api.posts.getAll.useQuery()

    if (isLoading) return (
        <div className="flex justify-center p-3">
            <LoadingSpinner size={30} />
        </div>
    )

    if (!data) return <div>Something went wrong</div>

    return (
        <div className="flex flex-col">
            {data.map((fullPost) => (
                <PostView {...fullPost} key={fullPost.post.id} />
            ))}
        </div>
    )
}

const Home: NextPage = () => {
    const { isSignedIn, isLoaded: userLoaded } = useAuth()

    // Start fetching posts as soon as the page loads
    api.posts.getAll.useQuery()

    if (!userLoaded) return <LoadingPage />

    return (
        <>
            <PageLayout>
                <div className="flex border-b border-slate-400 p-4">
                    {!isSignedIn && <SignInButton />}
                    {!!isSignedIn && <CreatePostWizard />}
                </div>
                <Feed />
            </PageLayout>
        </>
    );
};

export default Home;
