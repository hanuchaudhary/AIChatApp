"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { z } from "zod";
import { useOnboardingStore } from "@/store/AuthStore";
import { onboardingSchema } from "@/validations/validations";
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

const onboardingUsernameSchema = onboardingSchema.pick({ username: true });
type OnboardingUsernameSchema = z.infer<typeof onboardingUsernameSchema>;

export default function OnboardingUsernameForm() {
  const router = useRouter();
  const setData = useOnboardingStore((state) => state.setData);

  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const prevUsername = useOnboardingStore((state) => state.username);

  const form = useForm<OnboardingUsernameSchema>({
    resolver: zodResolver(onboardingUsernameSchema),
    defaultValues: {
      username: prevUsername,
    },
  });

  const username = form.watch("username");

  useEffect(() => {
    if (!username) {
      setResponse(null);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        setIsLoading(true);
        const res = await axios.post("/api/username", { username });
        setResponse(res.data.message);
      } catch (error: any) {
        setResponse(error.response?.data?.error || "An error occurred.");
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [username]);

  const onSubmit = form.handleSubmit((data) => {
    setData(data);
    router.push("/onboarding/email");
  });

  const handleContinue = () => {
    onSubmit();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-secondary-foreground rounded-xl p-6 py-10">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your username"
                    {...field}
                    className="w-full outline-none focus:outline-none focus:ring-0 border-0 bg-neutral-800"
                  />
                </FormControl>
                <FormMessage />
                {isLoading ? (
                  <p className="text-blue-500 text-sm mt-2">
                    Checking availability...
                  </p>
                ) : response ? (
                  <p
                    className={`text-sm mt-2 ${
                      response.includes("taken")
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {response}
                  </p>
                ) : null}
              </FormItem>
            )}
          />
          <NextButton handleContinue={handleContinue} />
        </form>
      </Form>
    </div>
  );
}
