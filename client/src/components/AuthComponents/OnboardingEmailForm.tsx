"use client";

import { onboardingSchema } from "@/validations/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/AuthStore";
import { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import NextButton from "./NextButton";
import BackButton from "./BackButton";

const onboardingEmailSchema = onboardingSchema.pick({ email: true });
type OnboardingEmailSchema = z.infer<typeof onboardingEmailSchema>;

export default function OnboardingEmailForm() {
  const router = useRouter();
  const setData = useOnboardingStore((state) => state.setData);
  const username = useOnboardingStore((state) => state.username);
  const email = useOnboardingStore((state) => state.email);

  const form = useForm<OnboardingEmailSchema>({
    resolver: zodResolver(onboardingEmailSchema),
    defaultValues: {
      email,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    setData(data);
    router.push("/onboarding/password");
  });

  useEffect(() => {
    if (!useOnboardingStore.persist.hasHydrated()) return;
    if (!username) {
      router.push("/onboarding/username");
    }
  }, [username, router]);

  const handleContinue = () => {
    onSubmit();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-secondary rounded-xl p-6 py-10">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                    className="dark:bg-neutral-700 bg-neutral-200 focus:ring-0 focus:border-none focus:outline-none outline-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-2">
            <BackButton
              handleBack={() => router.push("/onboarding/username")}
            />
            <NextButton handleContinue={handleContinue} />
          </div>
        </form>
      </Form>
    </div>
  );
}
