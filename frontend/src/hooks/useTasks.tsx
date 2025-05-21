import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getTasks, createTask, updateTask, deleteTask, getTaskById, searchTasks } from "@/services/tasks.services";

export const useSearchTasks = (searchTerm: string) =>
    useQuery({
        queryKey: ['tasks', 'search', searchTerm],
        queryFn: () => searchTasks({ query: searchTerm }),
        enabled: !!searchTerm,
    });

export const useTasks = (page: number, limit: number, status: string|null) => {
    const taskQuery = useQuery({
        queryKey: ['tasks', page, limit, status],
        queryFn: () => getTasks({ page, limit, status })
    });

    return {
        data: taskQuery.data,
        isLoading: taskQuery.isLoading,
        isError: taskQuery.isError,
        error: taskQuery.error,
    }
}