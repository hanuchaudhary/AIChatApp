"use client";

import { onboardingSchema } from "@/validations/validations";
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

const onboardingPasswordSchema = onboardingSchema.pick({
  password: true,
  confirmPassword: true,
});
type OnboardingPasswordSchema = z.infer<typeof onboardingPasswordSchema>;

export default function OnboardingPasswordForm() {
  const router = useRouter();
  const form = useForm<OnboardingPasswordSchema>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(onboardingPasswordSchema),
  });

  const username = useOnboardingStore((state) => state.username);
  const email = useOnboardingStore((state) => state.email);

  const onSubmit = form.handleSubmit((data) => {
    console.log({
      ...data,
      username,
      email,
    });
    router.push("/chat");
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="password" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="confirm password" {...field} />
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
