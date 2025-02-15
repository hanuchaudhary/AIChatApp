import { MenuIcon } from "lucide-react"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { ScrollArea } from "../ui/scroll-area"

export const ChatUsers: React.FC = () => {
    const dummyUsers = [
        { name: "John Doe", id: 1 },
        { name: "Jane Doe", id: 2 },
        { name: "John Smith", id: 3 },
        { name: "Jane Smith", id: 4 },
    ]
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MenuIcon className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <ScrollArea className="h-[calc(100vh-4rem)] w-full">
                    <div className="p-4">
                        <h2 className="text-xl font-semibold">Users</h2>
                        <div className="space-y-2">
                            {dummyUsers.map((user) => (
                                <div key={user.id} className="flex items-center space-x-2">
                                    <div className="h-8 w-8 bg-primary rounded-full"></div>
                                    <p>{user.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}