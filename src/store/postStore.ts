import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mmkvStorage } from "./storage";

// Define the Post interface; feel free to expand it with more fields as needed.
export interface Post {
  id: string | number;
  // Other post-related fields can be added here.
  hasSeen?: boolean;
}

export interface PostState {
  posts: Post[];
  newPosts: number;
  inPostScreen: boolean;
}

interface PostActions {
  setPosts: (newPostsArray: Post[]) => void;
  getPost: (id: string | number) => Post | undefined;
  updatePost: (updatedPost: Post) => void; // New action for updating a single post.
  updateInPostScreen: (inScreen: boolean) => void;
  recalcNewPosts: () => void;
}

const initialState: PostState = {
  posts: [],
  newPosts: 0,
  inPostScreen: false,
};

export const usePostStore = create<PostState & PostActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      setPosts: (newPostsArray: Post[]) => {
        if (get().inPostScreen) {
          // When user is in posts screen, mark all posts as seen and reset counter.
          const updatedPosts = newPostsArray.map((post) => ({
            ...post,
            hasSeen: true,
          }));
          set({ posts: updatedPosts, newPosts: 0 });
        } else {
          // Ensure each post has the `hasSeen` flag (defaulting to false if not set).
          const updatedPosts = newPostsArray.map((post) =>
            post.hasSeen === undefined ? { ...post, hasSeen: false } : post
          );
          // Count posts that haven't been seen.
          const unseenCount = updatedPosts.filter(
            (post) => !post.hasSeen
          ).length;
          set({ posts: updatedPosts, newPosts: unseenCount });
        }
      },
      getPost: (id: string | number) => {
        return get().posts.find((post) => post.id === id);
      },
      updatePost: (updatedPost: Post) => {
        const posts = get().posts;
        const exists = posts.some((post) => post.id === updatedPost.id);
        if (exists) {
          // Update the matching post (and mark it as seen)
          const updatedPosts = posts.map((post) =>
            post.id === updatedPost.id
              ? { ...post, ...updatedPost, hasSeen: true }
              : post
          );
          set({ posts: updatedPosts });
        } else {
          // Add new post if it doesn't exist yet
          set({ posts: [...posts, { ...updatedPost, hasSeen: true }] });
        }
      },
      updateInPostScreen: (inScreen: boolean) => {
        if (inScreen) {
          const updatedPosts = get().posts.map((post) => ({
            ...post,
            hasSeen: true,
          }));
          set({ inPostScreen: true, posts: updatedPosts, newPosts: 0 });
        } else {
          set({ inPostScreen: false });
        }
      },
      recalcNewPosts: () => {
        const unseenCount = get().posts.filter((post) => !post.hasSeen).length;
        set({ newPosts: unseenCount });
      },
    }),
    {
      name: "post-storage",
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
