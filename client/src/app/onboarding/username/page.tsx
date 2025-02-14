import OnboardingUsernameForm from "@/components/AuthComponents/OnboardingUsernameForm";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Username",
  description: "Onboarding Username",
};

export default function page() {
  return (
    <div className="">
      <OnboardingUsernameForm />
    </div>
  );
}
