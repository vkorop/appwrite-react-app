import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";
import { useUserContext } from "@/context/AuthContext";

type PostCardProps = {
    post: Models.Document;
    className?: string;
};

function PostCard({ post, className }: PostCardProps) {
  const { user } = useUserContext();

  return (
    <div className={`${className} post-card`}>
        <div className="flex items-center gap-4 mb-4">
            <Link
                to={`/profile/${post.creator.$id}`}
            >
                <img 
                    src={post.creator.imageURL} 
                    className="rounded-full w-12 h-12"
                />
            </Link>

            <div>
                <Link
                    to={`/profile/${post.creator.$id}`}
                >
                    <div className="base-medium text-light-1">
                        {post.creator.name}
                    </div>
                </Link>

                <div className="flex items-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                        {new Date(post.$createdAt).toLocaleDateString()}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                        {post.location}
                    </p>
                </div>
            </div>

            {user.id === post.creator.$id && (
              <Link
                  className="ml-auto"
                  to={`/edit-post/${post.$id}`}
              >
                  <img
                      src={"/assets/icons/edit.svg"}
                      className="w-6 h-6"
                  />
              </Link>
            )}
        </div>

        <div className="base-medium text-light-1 mb-2">
            {post.caption}
        </div>

        <ul className="flex gap-2 mb-4">
            {post.tags.map((tag: string, index: number) => (
                <li 
                    key={index}
                    className="text-light-3 subtle-regular">
                    #{tag}
                </li>
            ))}
        </ul>

        <Link
            to={`/post/${post.$id}`}
        >
            <img
                src={post.imageURL}
                className="post-card_img"
            />
        </Link>

        <PostStats
            post={post}
        />
    </div>
  )
}

export default PostCard