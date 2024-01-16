import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { useDeletePost, useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { Link, useNavigate, useParams } from "react-router-dom";

function PostDetails() {
  const { id } = useParams();
  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useGetPostById(id!);
  const { mutateAsync: deletePost, isPending: isDeleting } = useDeletePost(id!);
  const navigate = useNavigate();

  const handleDelete = async () => {
    await deletePost();

    navigate('/');
  };

  if (isLoading) {
    return (
      <Loader />
    );
  }

  return (
    <div className="post-card flex flex-col lg:flex-row gap-6 items-start w-full !max-w-none">
      <img
        src={post.imageURL}
        width={200}
        className="rounded-md"
      />

      <div className="w-full flex justify-between flex-col">
        <div>
          <div className="flex items-center gap-4 border-b border-b-dark-4 w-full pb-4 pt-2">
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

            <Link
                className="ml-auto"
                to={`/edit-post/${post.$id}`}
            >
                <img
                    src={"/assets/icons/edit.svg"}
                    className="w-6 h-6"
                />
            </Link>

            {isDeleting ? <Loader /> : (
              <img
                  onClick={handleDelete}
                  src={"/assets/icons/delete.svg"}
                  className="w-6 h-6 cursor-pointer"
              />
            )}
          </div>

          <div className="small-medium text-light-1 mb-2 mt-2">
              {post.caption}
          </div>

          <ul className="flex gap-2 mb-4">
              {post.tags.map((tag: string, index: number) => (
                  <li 
                      key={index}
                      className="text-light-3 small-medium">
                      #{tag}
                  </li>
              ))}
          </ul>
        </div>

        <PostStats post={post!} />
      </div>
    </div>
  )
}

export default PostDetails