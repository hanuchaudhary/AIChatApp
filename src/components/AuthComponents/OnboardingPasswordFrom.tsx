"use client";

import { onboardingSchema } from "@/validations/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuthStore, useOnboardingStore } from "@/store/AuthStore";
import { useEffect } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import NextButton from "./NextButton";
import BackButton from "./BackButton";

const onboardingPasswordSchema = onboardingSchema.pick({
  password: true,
  confirmPassword: true,
});
type OnboardingPasswordSchema = z.infer<typeof onboardingPasswordSchema>;

export default function OnboardingPasswordForm() {
  const router = useRouter();
  const { username, email } = useOnboardingStore();

  const form = useForm<OnboardingPasswordSchema>({
    resolver: zodResolver(onboardingPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { isLoading, registerUser } = useAuthStore();

  const onSubmit = form.handleSubmit((data) => {
    if (data.password !== data.confirmPassword) {
      form.setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    if (!email || !username) {
      router.push("/onboarding/email");
      return;
    }

    registerUser({
      email,
      username,
      password: data.password,
    });
  });

  useEffect(() => {
    if (!useOnboardingStore.persist.hasHydrated()) return;
    if (!username || !email) {
      router.push("/onboarding/email");
    }
  }, [username, email, router]);

  return (
    <div className="w-full max-w-md mx-auto bg-secondary rounded-xl p-6 py-10">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    className="dark:bg-neutral-700 bg-neutral-200 focus:ring-0 focus:border-none focus:outline-none outline-none"
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    className="dark:bg-neutral-700 bg-neutral-200 focus:ring-0 focus:border-none focus:outline-none outline-none"
                    type="password"
                    placeholder="Confirm your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-2">
            <BackButton handleBack={() => router.push("/onboarding/email")} />
            <NextButton isLoading={isLoading} handleContinue={onSubmit} />
          </div>
        </form>
      </Form>
    </div>
  );
}
