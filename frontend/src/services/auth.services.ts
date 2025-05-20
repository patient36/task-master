import axios from "@/util/axios.config";

export const login = async (credentials: { email: string; password: string }) => {
    try {
        const response = await axios.post("auth/login", credentials);
        localStorage.setItem("task-master-token", response.data.accessToken);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const register = async (credentials: { email: string, password: string, name: string }) => {
    try {
        const response = await axios.post("auth/create", credentials);
        localStorage.setItem("task-master-token", response.data.accessToken);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await axios.get("auth/me");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logout = async () => {
    try {
        const response = await axios.post("auth/logout");
        localStorage.removeItem("task-master-token");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const resetPassword = async (credentials: { email: string, OTP: string, newPassword: string }) => {
    try {
        const response = await axios.post("auth/reset-password", credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getOTP = async (email: string) => {
    try {
        const response = await axios.post("auth/forgot-password", {
            email,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteAccount = async (credentials: { password: string }) => {
    try {
        const response = await axios.delete("auth/me", { data: credentials });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUser = async (credentials: { email?: string, name?: string, oldPassword?: string, newPassword?: string }) => {
    try {
        const response = await axios.patch("auth/me", credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
};

