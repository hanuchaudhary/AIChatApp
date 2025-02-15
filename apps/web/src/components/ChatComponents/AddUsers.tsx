import { UserPlus } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";

export const AddUsers: React.FC = () => {
    const dummyUsers = [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Doe" },
        { id: 3, name: "Alice" },
        { id: 4, name: "Bob" },
    ]
    return (
        <AlertDialog >
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <UserPlus className="h-6 w-6" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <h2 className="text-lg font-semibold mb-4">Add User to Chat</h2>
                <Input placeholder="Search username" className="mb-4" />
                <ScrollArea>
                    <div className="space-y-4">
                        {dummyUsers.map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-2 bg-primary-foreground rounded-lg">
                                <span>{user.name}</span>
                                <Button variant="ghost">Add</Button>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </AlertDialogContent>
        </AlertDialog>
    );
}