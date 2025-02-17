import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

type UserAvatarProps = {
    src: string;
    fallback: string;
}

export const UserAvatar = ({ fallback, src }: UserAvatarProps) => {
    return (
        <Avatar>
            <AvatarImage src={src || "/default.jpg"} className="object-cover"/>
            <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
    )
}