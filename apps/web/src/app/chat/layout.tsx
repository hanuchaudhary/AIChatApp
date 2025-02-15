import { Navbar } from "@/components/Navbar";

export default function ChatLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-screen w-full flex">
            <Navbar />
            <div>
                {children}
            </div>
        </div>
    );
}
