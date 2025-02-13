"use client"

import { onboardingSchema } from "@/validations/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { useRouter } from "next/navigation"
import { useOnboardingStore } from "@/store/AuthStore"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const onboardingEmailSchema = onboardingSchema.pick({ email: true })
type OnboardingEmailSchema = z.infer<typeof onboardingEmailSchema>

export default function OnboardingEmailForm() {
  const router = useRouter()
  const setData = useOnboardingStore((state) => state.setData)
  const username = useOnboardingStore((state) => state.username)

  const form = useForm<OnboardingEmailSchema>({
    resolver: zodResolver(onboardingEmailSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    setData(data)
    router.push("/onboarding/password")
  })

  useEffect(() => {
    if (!useOnboardingStore.persist.hasHydrated()) return
    if (!username) {
      router.push("/onboarding/username")
    }
  }, [username, router])

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormDescription>We'll never share your email with anyone else.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Next</Button>
      </form>
    </Form>
  )
}

