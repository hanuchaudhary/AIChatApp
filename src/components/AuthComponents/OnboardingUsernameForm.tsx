"use client";

import { onboardingSchema} from "@/validations/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { useOnboardingStore } from "@/store/AuthStore";

const onboardingUsernameSchema = onboardingSchema.pick({ username: true });
type OnboardingUsernameSchema = z.infer<typeof onboardingUsernameSchema>;

export default function OnboardingUsernameForm() {
  const router = useRouter();
  const form = useForm<OnboardingUsernameSchema>({
    defaultValues: {
      username: "",
    },
    resolver: zodResolver(onboardingUsernameSchema),
  });

  const setData = useOnboardingStore((state) => state.setData);

  const onSubmit = form.handleSubmit((data) => {
    console.log(data);
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
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
