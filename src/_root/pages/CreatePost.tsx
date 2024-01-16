import PostForm from "@/components/shared/PostForm"
import { useCreatePost } from "@/lib/react-query/queriesAndMutations";

function CreatePost() {
  const { mutateAsync: createPost } = useCreatePost();

  return (
    <PostForm
      action="Create"
      mutate={createPost}
    />
  )
}

export default CreatePost