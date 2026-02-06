import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

type StoriesState = {
  hasHydrated: boolean;
  setHasHydrated: (hydrated: boolean) => void;
  /**
   * Record<restaurantId, Record<imageUrl, true>>
   * Usamos imageUrl como ID estable (si cambia el orden, se conserva visto/no visto).
   */
  seen: Record<string, Record<string, true>>;
  markSeen: (restaurantId: string, imageUrl: string) => void;
  isSeen: (restaurantId: string, imageUrl: string) => boolean;
  resetRestaurant: (restaurantId: string) => void;
  resetAll: () => void;
};

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useRestaurantStoriesStore = create<StoriesState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
      seen: {},
      markSeen: (restaurantId, imageUrl) => {
        const rid = restaurantId.trim();
        const url = imageUrl.trim();
        if (!rid || !url) return;
        set((state) => ({
          seen: {
            ...state.seen,
            [rid]: {
              ...(state.seen[rid] ?? {}),
              [url]: true,
            },
          },
        }));
      },
      isSeen: (restaurantId, imageUrl) => {
        const rid = restaurantId.trim();
        const url = imageUrl.trim();
        if (!rid || !url) return false;
        return Boolean(get().seen[rid]?.[url]);
      },
      resetRestaurant: (restaurantId) => {
        const rid = restaurantId.trim();
        if (!rid) return;
        set((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [rid]: _removed, ...rest } = state.seen;
          return { seen: rest };
        });
      },
      resetAll: () => set({ seen: {} }),
    }),
    {
      name: "restaurant-stories-seen",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : noopStorage,
      ),
      version: 1,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

