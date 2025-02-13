export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-2xl mx-auto h-screen">
      <div>Onboarding Layout</div>
      {children}
    </div>
  );
}
