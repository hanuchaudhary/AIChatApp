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
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/AuthStore";

const onboardingEmailSchema = onboardingSchema.pick({ email: true });
type OnboardingEmailSchema = z.infer<typeof onboardingEmailSchema>;

export default function OnboardingEmailForm() {
  const router = useRouter();
  const form = useForm<OnboardingEmailSchema>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(onboardingEmailSchema),
  });

  const setData = useOnboardingStore((state) => state.setData);

  const onSubmit = form.handleSubmit((data) => {
    console.log(data);
    setData(data);
    router.push("/onboarding/password");
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
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
