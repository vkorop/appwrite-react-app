import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard"
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations"

function Home() {
  const {
    data: recentPosts,
    isLoading: isRecentPostsLoading,
    isError: isRecentPostsError,
    error: recentPostsError,
  } = useGetRecentPosts();

  if (isRecentPostsLoading) {
    return (
      <Loader />
    )
  }

  if (isRecentPostsError) {
    return (
      <>
        <div className="flex flex-col items-center justify-center w-full h-96">
          <p className="text-lg text-gray-500">
            {recentPostsError?.message || "Something went wrong."}
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <h2 className="h3-bold md:h2-bold text-left w-full mb-4">
        Home Feed
      </h2>

      {recentPosts!.documents.map((post) => (
        <PostCard
          className="mb-4"
          key={post.$id}
          post={post}
        />
      ))}
    </>
  )
}

export default Home