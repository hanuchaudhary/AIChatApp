import { useEffect, useState } from "react";
import axios from "axios";
export default function useUsername(username: string) {
    const [isLoading, setIsLoading] = useState(true);
    const [response, setResponse] = useState(null);

    const fetchUsername = async () => {
        try {
            setIsLoading(true);
            const availableUsername = await axios.post("/api/username", { username });
            console.log(availableUsername.data);
            setResponse(availableUsername.data);
        } catch (error: any) {
            setResponse(error.response.data.error);
            console.error(error);
        } finally {
            setIsLoading(false);
            setResponse(null);
        }
    }

    useEffect(() => {
        fetchUsername();
    }, [username]);

    return { isLoading, response };

}