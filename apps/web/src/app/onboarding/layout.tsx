import AuthBottom from "@/components/AuthComponents/AuthBottom";
import { RouteProgress } from "@/components/AuthComponents/RouteProgess";

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-[calc(100vh-6rem)]">
      <div className="flex h-full items-center justify-center flex-col w-full">
        <div className="w-full">
          <RouteProgress>{children}</RouteProgress>
        </div>
      </div>
    </div>
  );
}
