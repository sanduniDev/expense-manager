import { useQuery } from "@tanstack/react-query";

export const useOverview = () => {

    const { data, isLoading, error } = useQuery({
        queryKey: ["overview"],
        queryFn: async () => {
            const res = await fetch("/api/dashboard/overview");
            return res.json();
        },
    });

    return {
        data,
        isLoading,
        error
    }
}