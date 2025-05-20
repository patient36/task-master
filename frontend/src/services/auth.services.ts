import axios from "@/util/axios.config";

export const login = async (credentials: { email: string; password: string }) => {
    const { email, password } = credentials;
    try {
        const response = await axios.post("auth/login", {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const register = async (email: string, password: string,name: string) => {
    try {
        const response = await axios.post("auth/create", {
            email,
            password,
            name,
        });
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
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const resetPassword = async (email: string, OTP: string, newPassword: string) => {
    try {
        const response = await axios.post("auth/reset-password", {
            email,
            OTP,
            newPassword,
        });
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

export const deleteAccount = async (password: string) => {
    try {
        const response = await axios.delete("auth/me", {
            data: {
                password,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUser = async (email?: string, name?: string, oldPassword?: string, newPassword?: string) => {
    try {
        const response = await axios.patch("auth/me", {
            email,
            name,
            oldPassword,
            newPassword,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

