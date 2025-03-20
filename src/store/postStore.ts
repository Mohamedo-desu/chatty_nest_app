import { create } from "zustand";

export interface Post {
  id: string | number;
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
  updatePost: (updatedPost: Post) => void;
  removePost: (id: string | number) => void;
  updateInPostScreen: (inScreen: boolean) => void;
  recalcNewPosts: () => void;
}

const initialState: PostState = {
  posts: [],
  newPosts: 0,
  inPostScreen: false,
};

export const usePostStore = create<PostState & PostActions>()((set, get) => ({
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
      const unseenCount = updatedPosts.filter((post) => !post.hasSeen).length;
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
  removePost: (id: string | number) => {
    // Remove the post with the given id.
    const posts = get().posts;
    set({ posts: posts.filter((post) => post.id !== id) });
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
}));
