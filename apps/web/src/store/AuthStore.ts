import { onboardingSchema } from "@/validations/validations";
import { create } from "zustand";
import { createJSONStorage, persist, PersistOptions } from "zustand/middleware";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

type OnboardingData = Partial<z.infer<typeof onboardingSchema>>;

type OnboardingState = OnboardingData & {
  setData: (data: OnboardingData) => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist<OnboardingState>(
    (set) => ({
      setData: (data) => set(data),
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => localStorage),
    } as PersistOptions<OnboardingState>
  )
);

interface AuthStore {
  registerUser: ({
    email,
    password,
    username,
  }: {
    email: string;
    password: string;
    username: string;
  }) => void;
  isLoading: boolean;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLoading: false,
  registerUser: async ({ email, password, username }) => {
    try {
      set({ isLoading: true });
      const response = await axios.post("/api/auth/register", {
        email,
        password,
        username,
      });
      console.log(response);
      toast.success("Account created successfully");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ||
            "An error occurred while creating your account"
        );
      } else {
        toast.error("An error occurred while creating your account");
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));
