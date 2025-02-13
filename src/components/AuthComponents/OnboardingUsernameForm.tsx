"use client";

import { onboardingSchema } from "@/validations/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/AuthStore";
import { Button } from "@/components/ui/button";
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
import { useEffect, useState } from "react";
import axios from "axios";

const onboardingUsernameSchema = onboardingSchema.pick({ username: true });
type OnboardingUsernameSchema = z.infer<typeof onboardingUsernameSchema>;

export default function OnboardingUsernameForm() {
  const router = useRouter();
  const setData = useOnboardingStore((state) => state.setData);

  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const form = useForm<OnboardingUsernameSchema>({
    resolver: zodResolver(onboardingUsernameSchema),
    defaultValues: {
      username: "",
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
        setResponse(res.data.message); // "Username is available"
      } catch (error: any) {
        setResponse(error.response?.data?.error || "An error occurred.");
      } finally {
        setIsLoading(false);
      }
    }, 500); // Debounce API calls

    return () => clearTimeout(delayDebounceFn);
  }, [username]);

  const onSubmit = form.handleSubmit((data) => {
    setData(data);
    router.push("/onboarding/email");
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
              {isLoading ? (
                <p className="text-blue-500 text-sm">Checking availability...</p>
              ) : response ? (
                <p
                  className={`text-sm ${
                    response.includes("taken")
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {response}
                </p>
              ) : null}
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          Next
        </Button>
      </form>
    </Form>
  );
}
