import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { useUserContext } from "@/context/AuthContext";
import { useGetSavedPosts } from "@/lib/react-query/queriesAndMutations";

function Saved() {
  const { user } = useUserContext();
  const {
    data: savedPosts,
    isLoading: isSavedPostsLoading,
    isError: isSavedPostsError,
    error: savedPostsError,
  } = useGetSavedPosts(user.id);

  if (isSavedPostsLoading) {
    return (
      <Loader />
    )
  }

  console.log(savedPosts)

  return (
    <>
      <h2 className="h3-bold md:h2-bold text-left w-full mb-4">
          Saved
      </h2>

      {savedPosts!.documents.map(({ $id, post }) => (
        <PostCard
          className="mb-4"
          key={$id}
          post={post}
        />
      ))}
    </>
  )
}

export default Saved