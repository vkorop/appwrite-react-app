import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Input } from "@/components/ui/input";
import { useGetPosts, useSearchPosts } from "@/lib/react-query/queriesAndMutations";
import { useDebounce } from "@uidotdev/usehooks";
import { Models } from "appwrite";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

function Explore() {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const { data: searchPosts, isLoading: isSearchLoading } = useSearchPosts(debouncedSearchValue);
  const { data: popularPosts, isLoading: isLoadingPosts, fetchNextPage, hasNextPage } = useGetPosts();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage();
    }
  }, [inView, searchValue]);

  const posts = (debouncedSearchValue === '' ? popularPosts?.pages.map(({ documents }) => documents).flat() : searchPosts?.documents) || [];
  const isLoading = (debouncedSearchValue === '' && isLoadingPosts) || (searchValue !== '' && isSearchLoading);

  return (
    <>
      <h2 className="h3-bold md:h2-bold text-left w-full mb-8">
        Search Posts
      </h2>

      <Input
        type="text"
        placeholder="Search"
        className="explore-search"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />

      <h3 className="h4-bold md:h3-bold text-left w-full mb-8 mt-8">
        Popular Today
      </h3>

      {isLoading ? (
        <div className="flex w-full justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {!!posts.length && (
            <>
                {posts.map((post: Models.Document) => (
                  <Link 
                    to={`/post/${post.$id}`}
                    className="relative" 
                    key={post.$id}
                  >
                    <img
                      className="w-full h-64 object-cover object-center rounded-xl mb-8"
                      src={post.imageURL}
                      alt={post.caption}
                    />

                    <div className="absolute bottom-0 left-0 p-4 flex items-center w-full">
                      <div className="flex items-center bg-dark-2 p-2 pl-0 box-border rounded-l-full rounded-r-xl h-10">
                        <img
                          className="w-10 h-10 rounded-full object-cover object-center"
                          src={post.creator.imageURL}
                          alt={post.creator.username}
                        />

                        <p className="text-white font-bold ml-2">
                          {post.creator.name}
                        </p>
                      </div>

                      <PostStats 
                        className="ml-auto w-24 bg-dark-2 p-2 box-content rounded-xl"
                        post={post} 
                      />
                    </div>
                  </Link>
                ))}
            </>
          )}
        </>
      )}

      {hasNextPage && !searchValue && (
        <div 
          ref={ref}
          className="flex w-full justify-center mt-10"
        >
          <Loader />
        </div>
      )}
    </>
  );
}

export default Explore
