import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPost, createUserAccount, getCurrentUser, getInfinitePosts, getPostById, getRecentPosts, getSavedPosts, savePost, searchPosts, signInAccount, signOutAccount, unsavePost, updatePost } from "../appwrite/api";
import { QUERY_KEYS } from "./queryKeys";
import { Models } from "appwrite";

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: createUserAccount
    });
};

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: signInAccount
    });
};

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount
    });
};

export const useCreatePost = () => {
    return useMutation({
        mutationFn: createPost
    });
};

export const useUpdatePost = () => {
    return useMutation({
        mutationFn: updatePost
    });
};

export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts
    });
}

export const useSavePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, userId }: { postId: string, userId: string }) => savePost(postId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            });

            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            });
        }
    });
}

export const useUnsavePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: unsavePost,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            });

            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            });
        }
    });
}

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser
    });
};

export const useGetPostById = (postId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId)
    });
};

export const useDeletePost = (postId: string) => {
    return useMutation({
        mutationFn: () => getPostById(postId)
    });
}

export const useGetSavedPosts = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_SAVED_POSTS, userId],
        queryFn: () => getSavedPosts(userId)
    });
}

export const useGetPosts = () => {
    return useInfiniteQuery<Models.DocumentList<any>>({
        queryKey: [QUERY_KEYS.GET_POSTS],
        queryFn: getInfinitePosts as any,
        initialPageParam: 0,
        getNextPageParam: (lastPage: any) => {
            if (lastPage && lastPage.documents.length === 0) {
              return null;
            }
      
            return lastPage.documents[lastPage.documents.length - 1].$id;
          }
    });
};

export const useSearchPosts = (search: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, search],
        queryFn: () => searchPosts(search),
        enabled: search.length > 0
    });
};