import { client } from "@/supabase/config";
import { USER_PROPS } from "@/types/user";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { deleteStoredValues, getStoredValues, mmkvStorage } from "./storage";

export interface UserState {
  currentUser: USER_PROPS;
  setCurrentUser: (user: USER_PROPS) => void;
  logOut: (signOut: any) => Promise<void>;
}

// Define the default value for currentUser
const defaultUser: USER_PROPS = {} as USER_PROPS;

// Create the store
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: defaultUser,
      setCurrentUser: (currentUser: USER_PROPS) => set({ currentUser }),
      logOut: async (signOut) => {
        const { pushTokenString } = getStoredValues(["pushTokenString"]);

        const userId = get().currentUser.user_id;

        if (pushTokenString) {
          const { error } = await client.rpc("remove_push_token", {
            push_token: pushTokenString,
            user_id: userId,
          });
          if (error) {
            console.error("Error deleting push token in Supabase:", error);
          }
        }

        // Clear persisted data
        deleteStoredValues(["pushTokenString", "User-storage"]);

        set({ currentUser: defaultUser });
        signOut();
      },
    }),
    {
      name: "User-storage",
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
