import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { login, logout, getCurrentUser, register, resetPassword, getOTP, deleteAccount, updateUser } from '@/services/auth.services';

export const useAuth = () => {
    const queryClient = useQueryClient();

    const userQuery = useQuery({
        queryKey: ['auth', 'user'],
        queryFn: getCurrentUser,
        retry: false,
    });

    const loginMutation = useMutation({
        mutationKey: ['auth', 'login'],
        mutationFn: login,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
        },
    });

    const registerMutation = useMutation({
        mutationKey: ['auth', 'register'],
        mutationFn: ({ name, email, password }: { email: string; password: string, name: string }) => register(email, password, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
        }
    })

    const resetPasswordMutation = useMutation({
        mutationKey: ['auth', 'reset-password'],
        mutationFn: ({ email, OTP, newPassword }: { email: string; OTP: string; newPassword: string }) =>
            resetPassword(email, OTP, newPassword)
    })

    const forgotPasswordMutation = useMutation({
        mutationKey: ['auth', 'forgot-password'],
        mutationFn: getOTP
    })

    const logoutMutation = useMutation({
        mutationKey: ['auth', 'logout'],
        mutationFn: logout,
        onSuccess: () => {
            queryClient.setQueryData(['auth', 'user'], null);
        },
    });

    const deleteAccountMutation = useMutation({
        mutationKey: ['auth', 'delete-account'],
        mutationFn: deleteAccount,
        onSuccess: () => {
            queryClient.setQueryData(['auth', 'user'], null);
        }
    })

    const updateUserMutation = useMutation({
        mutationKey: ['auth', 'update-user'],
        mutationFn: ({ name, oldPassword, email, newPassword }: { email: string; name: string; newPassword: string, oldPassword: string }) => updateUser(name, email, oldPassword, newPassword),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
        }
    })

    return {
        user: userQuery.data,
        isLoading: userQuery.isLoading,
        isError: userQuery.isError,
        error: userQuery.error,

        login: loginMutation.mutate,
        register: registerMutation.mutate,
        resetPassword: resetPasswordMutation.mutate,
        forgotPassword: forgotPasswordMutation.mutate,
        logout: logoutMutation.mutate,
        deleteAccount: deleteAccountMutation.mutate,
        updateUser: updateUserMutation.mutate,
    };
};