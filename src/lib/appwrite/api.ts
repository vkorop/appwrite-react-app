import { INewPost, INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        );
    
        if (!newAccount) throw new Error("Account creation failed.");
    
        const imageURL = await avatars.getInitials(newAccount.name);
    
        return await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            username: user.username,
            email: newAccount.email,
            imageURL
        })
    } catch (error) {
        console.error(error);
    }
}

export async function saveUserToDB(user: {
    name: string;
    username: string;
    email: string;
    accountId: string;
    imageURL: URL;
}) {
    try {
        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            user
        );
    } catch (error) {
        console.error(error);
    }
}

export async function signInAccount(user: { email: string, password: string }) {
    try {
        return await account.createEmailSession(user.email, user.password);
    } catch (error) {
        console.error(error);
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
    
        if (!currentAccount) throw new Error("No account found.");
    
        const user = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );
    
        if (!user) throw new Error("No user found.");
    
        return user.documents[0];
    } catch (error) {
        console.error(error);
    }
}

export async function signOutAccount() {
    try {
        return await account.deleteSession("current");
    } catch (error) {
        console.error(error);
    }
}

export async function uploadFile(file: File) {
    try {
        return await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file,
        );
    } catch (error) {
        console.error(error);
    }
}

export async function getFilePreview(id: string) {
    try {
        return await storage.getFilePreview(
            appwriteConfig.storageId,
            id,
            2000,
            2000,
            "top",
            100
        );
    } catch (error) {
        console.error(error);
    }
}

export async function deleteFile(id: string) {
    try {
        return await storage.deleteFile(
            appwriteConfig.storageId,
            id,
        );
    } catch (error) {
        console.error(error);
    }
}

export async function createPost(post: INewPost) {
    try {
        const uploadedFile = await uploadFile(post.file[0]);
    
        if (!uploadedFile) throw new Error("File upload failed.");
    
        const fileUrl = await getFilePreview(uploadedFile.$id);
    
        if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
    
            throw Error;
          }
    
        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            ID.unique(),
            {
                caption: post.caption,
                imageId: uploadedFile.$id,
                imageURL: fileUrl,
                tags: post.tags?.split(',').map(tag => tag.trim()),
                creator: post.userId,
                location: post.location,
            }
        );
    } catch (error) {
        console.error(error);
    }
}

export async function updatePost(post: INewPost & { postId: string, imageId: string }) {
    try {
        const uploadedFile = await uploadFile(post.file[0]);

        if (!uploadedFile) throw new Error("File upload failed.");

        const fileUrl = await getFilePreview(uploadedFile.$id);

        if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
    
            throw Error;
        }

        deleteFile(post.imageId).catch(console.error);

        console.log('post', post);

        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            post.postId,
            {
                caption: post.caption,
                tags: post.tags?.split(',').map(tag => tag.trim()),
                location: post.location,
                imageId: uploadedFile.$id,
                imageURL: fileUrl,
            }
        );

        console.log('updatedPost', updatedPost);
    
        if (!updatedPost) throw new Error("Post update failed.");
    
        return updatedPost;
    } catch (error) {
        console.error(error);
    }
}

export async function getRecentPosts() {
    try {
        return await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            [Query.orderDesc('$createdAt'), Query.limit(10)]
        );
    } catch (error) {
        console.error(error);
    }
}

export async function savePost(post: string, user: string) {
    try {
        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                post,
                user
            }
        );
    } catch (error) {
        console.error(error);
    }
}

export async function unsavePost(saveId: string) {
    try {
        return await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            saveId
        );
    } catch (error) {
        console.error(error);
    }
}

export async function getPostById(postId: string) {
    try {
        return await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            postId
        );
    } catch (error) {
        console.error(error);
    }
}

export async function deletePost(postId: string) {
    try {
        return await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            postId
        );
    } catch (error) {
        console.error(error);
    }
}

export async function getSavedPosts(userId: string) {
    try {
        return await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            [Query.equal('user', userId)]
        );
    } catch (error) {
        console.error(error);
    }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
    const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(2)];
  
    if (pageParam) {
      queries.push(Query.cursorAfter(pageParam.toString()));
    }
  
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postsCollectionId,
        queries
      );
  
      if (!posts) throw Error;
  
      return posts;
    } catch (error) {
      console.log(error);
    }
  }
  
export async function searchPosts(search: string) {
    try {
        return await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            [Query.search('caption', search)]
        );
    } catch (error) {
        console.error(error);
    }
}