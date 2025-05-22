import axios from "@/util/axios.config";

export const getTasks = async ({ page, limit, status }: { page: number; limit: number; status: string | null }) => {
    try {
        const response = await axios.get('/tasks/all', { params: { page, limit, status } });
        return response.data;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error;
    }
};

export const createTask = async (taskData: { title: string, description: string, dueTime: string, priority?: string }) => {
    try {
        const response = await axios.post("/tasks/create", taskData);
        return response.data;
    } catch (error) {
        console.error("Error creating task:", error);
        throw error;
    }
};

export const updateTask = async (taskId: string, taskData: { title?: string, description?: string, dueTime?: string, priority?: string, status?: string }) => {
    try {
        const response = await axios.patch(`/tasks/${taskId}`, taskData);
        return response.data;
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
};

export const deleteTask = async (taskId: string) => {
    try {
        const response = await axios.delete(`/tasks/${taskId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting task:", error);
        throw error;
    }
};


export const searchTasks = async (params: { query: string }) => {
    try {
        const response = await axios.get(`/tasks/search`, {
            params: params,
        });
        return response.data;
    } catch (error) {
        console.error("Error searching tasks:", error);
        throw error;
    }
}