import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getTasks, createTask, updateTask, deleteTask, getTaskById, searchTasks } from "@/services/tasks.services";

export const useSearchTasks = (searchTerm: string) =>
    useQuery({
        queryKey: ['tasks', 'search', searchTerm],
        queryFn: () => searchTasks({ query: searchTerm }),
        enabled: !!searchTerm,
    });