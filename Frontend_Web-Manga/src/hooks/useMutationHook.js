// hooks/useMutationHook.js
import { useMutation } from "@tanstack/react-query";

export const useMutationHooks = (fnCallback, options = {}) => {
    const mutation = useMutation({
        mutationFn: fnCallback,
        onSuccess: (data) => {
            if (options.onSuccess) {
                options.onSuccess(data);
            }
        },
        onError: (error) => {
            if (options.onError) {
                options.onError(error);
            }
        },
    });

    return mutation;
};
