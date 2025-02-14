import OnboardingEmailForm from "@/components/AuthComponents/OnboardingEmailForm";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Email",
  description: "Onboarding Email",
};

export default function page() {
  return <OnboardingEmailForm />;
}
