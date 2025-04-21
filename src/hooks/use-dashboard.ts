import { useQuery } from "@tanstack/react-query";

export const useDashboards = () => {

    const { data, isLoading, error } = useQuery({
        queryKey: ["dashboard"],
        queryFn: async () => {
            const res = await fetch("/api/dashboard");
            return res.json();
        },
    });

    return {
        data,
        isLoading,
        error
    }
}