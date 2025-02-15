import { onboardingSchema } from "@/validations/validations";
import { create } from "zustand";
import { createJSONStorage, persist, PersistOptions } from "zustand/middleware";
import { z } from "zod";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

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
  registerUser: ({ email, password, username }: { email: string, password: string, username: string }) => void;
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
        username
      });
      console.log(response);
      toast({
        title: "Account created",
        description: "Your account has been created successfully",
      })
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while creating your account",
      })
    }finally{
      set({ isLoading: false });
    }
  },
}));
