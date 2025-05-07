import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { AuthState, Credentials, RegisterData, User } from "../../types";

// Mock user database for demo purposes
const MOCK_USERS = [
  {
    id: "1",
    email: "demo@example.com",
    password: "123456",
    name: "Demo User",
  },
];

// Initial auth state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Combined store type: state + actions
type Store = AuthState & {
  login: (credentials: Credentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
};


// Zustand store with persist middleware
export const useAppStore = create<Store>()(
  persist<Store>(
    (set, get) => ({
      ...initialState,

      login: async (credentials: Credentials) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise((resolve) => setTimeout(resolve, 800));
          const user = MOCK_USERS.find((u) => u.email === credentials.email);

          if (!user || user.password !== credentials.password) {
            throw new Error("Invalid credentials");
          }

          const token = `mock-jwt-token-${Date.now()}`;
          const userData: User = {
            id: user.id,
            email: user.email,
            name: user.name,
          };

          set({
            user: userData,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise((resolve) => setTimeout(resolve, 800));
          const userExists = MOCK_USERS.some((u) => u.email === data.email);
          if (userExists) throw new Error("User already exists");

          const newUser = {
            id: `${MOCK_USERS.length + 1}`,
            email: data.email,
            password: data.password,
            name: data.name,
          };

          MOCK_USERS.push(newUser);

          const token = `mock-jwt-token-${Date.now()}`;
          const userData: User = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
          };

          set({
            user: userData,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
        }
      },

      logout: () => {
        set(initialState);
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        ...state,
        isLoading: false,
        error: null,
        login: undefined!,
        register: undefined!,
        logout: undefined!,
        clearError: undefined!,
      }),
    }
  )
);
