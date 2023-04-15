
import { type RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";


dayjs.extend(relativeTime)

type PostWithAuthor = RouterOutputs['posts']['getAll'][number]

export const PostView = (props: PostWithAuthor) => {
    const { post, author } = props
    return (
        <div className="flex gap-3 w-full p-4 border-b border-slate-200">
            <Image
                height={56}
                width={56}
                className="rounded-full"
                src={author.profileImageUrl}
                alt={author.username} />
            <div className="flex flex-col grow">
                <div className="text-slate-300">
                    <Link href={`/@${author.username}`}>
                        <span className="font-semibold">{`@${author.username}`}</span>
                    </Link>
                    <Link href={`post/${post.id}`}>
                        <span>{` · ${dayjs(post.createdAt).fromNow()}`}</span>
                    </Link>
                </div>
                <div className="text-2xl">{post.content}</div>
            </div>
        </div>
    )
}