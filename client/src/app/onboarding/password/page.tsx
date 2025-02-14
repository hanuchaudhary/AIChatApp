import OnboardingPasswordForm from '@/components/AuthComponents/OnboardingPasswordFrom'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "Password",
  description: "Onboarding Password",
};

export default function page() {
  return (
    <OnboardingPasswordForm/>
  )
}
