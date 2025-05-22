import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getTasks, createTask, updateTask, deleteTask, searchTasks } from "@/services/tasks.services";

export const useSearchTasks = (searchTerm: string) =>
    useQuery({
        queryKey: ['tasks', 'search', searchTerm],
        queryFn: () => searchTasks({ query: searchTerm }),
        enabled: !!searchTerm,
    });

export const useTasks = (page: number, limit: number, status: string | null) => {
    const taskQuery = useQuery({
        queryKey: ['tasks', page, limit, status],
        queryFn: () => getTasks({ page, limit, status }),
        placeholderData: (prev) => prev,
    });

    return {
        data: taskQuery.data,
        isLoading: taskQuery.isLoading,
        isError: taskQuery.isError,
        error: taskQuery.error,
    }
}

export const useCreateTask = () => {
    const queryClient = useQueryClient();

    const createTaskMutation = useMutation({
        mutationKey: ['tasks', 'create'],
        mutationFn: createTask,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === 'tasks',
            });
        },
    });

    return {
        addTask: createTaskMutation.mutate
    }
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    const deleteTaskMutation = useMutation({
        mutationKey: ['tasks', 'delete'],
        mutationFn: deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === 'tasks',
            });
        },
    });

    return {
        deleteTask: deleteTaskMutation.mutate
    }
}

export const useUpdateTask = () => {
    const queryClient = useQueryClient();

    const updateTaskMutation = useMutation({
        mutationKey: ['tasks', 'update'],
        mutationFn: ({ taskId, taskData }: { taskId: string, taskData: { title?: string; description?: string; dueTime?: string; priority?: string; status?: string; } }) =>
            updateTask(taskId, taskData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === 'tasks',
            });
        },
    });

    return {
        updateTask: updateTaskMutation.mutate
    }
}