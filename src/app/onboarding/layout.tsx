import AuthBottom from "@/components/AuthComponents/AuthBottom";
import { RouteProgress } from "@/components/AuthComponents/RouteProgess";
import Navbar from "@/components/Navbar";

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen">
      <Navbar />
      <div className="flex h-full items-center justify-center flex-col w-full">
        <div className="w-full">
          <RouteProgress>{children}</RouteProgress>
        </div>
      </div>
    </div>
  );
}
