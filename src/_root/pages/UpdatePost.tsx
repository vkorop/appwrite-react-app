import Loader from "@/components/shared/Loader";
import PostForm from "@/components/shared/PostForm"
import { useGetPostById, useUpdatePost } from "@/lib/react-query/queriesAndMutations";
import { useParams } from "react-router-dom";

function UpdatePost() {
  const { id } = useParams();
  const { mutateAsync: updatePost } = useUpdatePost();
  const {
    data: post,
    isLoading: isPostLoading,
    isError: isPostError,
    error: postError,
  } = useGetPostById(id!);

  if (isPostLoading) {
    return (
      <Loader />
    );
  }

  return (
    <PostForm
      action="Update"
      post={post}
      mutate={updatePost}
    />
  )
}

export default UpdatePost