import { useGetCurrentUser, useSavePost, useUnsavePost } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import { useEffect, useState } from "react";
import Loader from "./Loader";

type PostStatsProps = {
  post: Models.Document;
  className?: string;
};

function PostStats({ post, className }: PostStatsProps) {
  // const likesList = post.likes.map((user: Models.Document) => user.$id);

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: savePost, isPending: isSavePostLoading } = useSavePost();
  const { mutate: unsavePost, isPending: isUnsavePostLoading } = useUnsavePost();

  const { data: user } = useGetCurrentUser();

  const checkIfLiked = () => isLiked; // likesList.includes(userId);
  const savedPost = user?.save.find((saved: Models.Document) => saved.post.$id === post.$id);

  useEffect(() => {
    setIsSaved(!!savedPost);
  }, [user]);

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
    } else {
      setIsLiked(true);
    }
  };

  const handleSave = () => {
    if (isSaved) {
      setIsSaved(false);
      unsavePost(savedPost.$id);
    } else {
      setIsSaved(true);
      savePost({ postId: post.$id, userId: user!.$id });
    }
  }

  return (
    <div className={`${className} flex-between`}>
        <div
          onClick={handleLike} 
          className="flex gap-2 cursor-pointer base-semibold items-center">
            <img
                src={checkIfLiked() ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
                className="w-6 h-6"
            />

            {0}
        </div>

        {isSavePostLoading || isUnsavePostLoading ? <Loader/> : (
          <img
              onClick={handleSave}
              src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
              className="w-6 h-6 cursor-pointer"
          />
        )}
    </div>
  )
}

export default PostStats