import { LoginFormController, LoginFormModel } from "./LoginForm.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import * as yup from "yup";
import { isUndefined } from "lodash";
import { useForm } from "react-hook-form";
// import { useQueryClient } from "@tanstack/react-query"; // Not strictly needed here unless invalidating other queries on login
import { useLogin } from "@infrastructure/apis/api-management";
import { useCallback } from "react";
import { useAppRouter } from "@infrastructure/hooks/useAppRouter";
import { useAppDispatch } from "@application/store"; // CORRECTED IMPORT PATH
import { toast } from "react-toastify";
import { UserRoleEnum } from "@infrastructure/apis/client";
import { setLoginData } from "@application/state-slices/profile/profileSlice"; // Keep this for setLoginData
import { AppRoute } from "routes";

/**
 * Use a function to return the default values of the form and the validation schema.
 */
const getDefaultValues = (initialData?: { email: string }) => {
    const defaultValues = {
        email: "",
        password: ""
    };

    if (!isUndefined(initialData)) {
        return {
            ...defaultValues,
            ...initialData,
        };
    }

    return defaultValues;
};

/**
 * Create a hook to get the validation schema.
 */
const useInitLoginForm = () => {
    const { formatMessage } = useIntl();
    const defaultValues = getDefaultValues();

    const schema = yup.object().shape({
        email: yup.string()
            .required(formatMessage(
                { id: "globals.validations.requiredField" },
                { fieldName: formatMessage({ id: "globals.email" }) }
            ))
            .email(formatMessage({ id: "globals.validations.emailInvalid" })) // Added specific email invalid message
            .default(defaultValues.email),
        password: yup.string()
            .required(formatMessage(
                { id: "globals.validations.requiredField" },
                { fieldName: formatMessage({ id: "globals.password" }) }
            ))
            .default(defaultValues.password),
    });

    const resolver = yupResolver(schema);

    return { defaultValues, resolver };
};

/**
 * Create a controller hook for the form and return any data that is necessary for the form.
 */
export const useLoginFormController = (): LoginFormController => {
    const { formatMessage } = useIntl();
    const { defaultValues, resolver } = useInitLoginForm();
    const { navigate } = useAppRouter(); // Using navigate directly for more flexibility
    const { mutateAsync: login, status } = useLogin();
    // const queryClient = useQueryClient(); // Keep if other queries need invalidation
    const dispatch = useAppDispatch();

    const submit = useCallback(async (data: LoginFormModel) => { // Made submit async
        try {
            const result = await login(data); // Await the login mutation

            if (result.response) {
                const { token, user } = result.response;
                if (token && user) {
                    dispatch(setLoginData({ token, user })); // Dispatch both token and user DTO

                    window.dispatchEvent(new Event("login")); // Notify Navbar or other components

                    toast.success(formatMessage({ id: "notifications.messages.authenticationSuccess" }));

                    // Redirect based on role
                    switch (user.role) {
                        case UserRoleEnum.Client:
                            navigate(AppRoute.ClientDashboard);
                            break;
                        case UserRoleEnum.Sitter:
                            navigate(AppRoute.SitterDashboard);
                            break;
                        case UserRoleEnum.Admin:
                            navigate(AppRoute.AdminUsers); // Or a dedicated Admin Dashboard
                            break;
                        default:
                            navigate(AppRoute.Index);
                            break;
                    }
                } else {
                    toast.error(formatMessage({ id: "notifications.errors.loginFailed" }) + ": Invalid server response (missing token or user data).");
                }
            } else if (result.errorMessage) {
                toast.error(result.errorMessage.message || formatMessage({ id: "notifications.errors.loginFailed" }));
            } else {
                toast.error(formatMessage({ id: "notifications.errors.loginFailed" }));
            }
        } catch (error: any) {
            console.error("Login mutation error:", error);
            const apiErrorMessage = error?.response?.data?.errorMessage?.message || error?.message;
            toast.error(apiErrorMessage || formatMessage({ id: "error.defaultApi" }));
        }
    }, [login, dispatch, navigate, formatMessage]);


    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormModel>({
        defaultValues,
        resolver
    });

    return {
        actions: {
            handleSubmit,
            submit,
            register
        },
        computed: {
            defaultValues,
            isSubmitting: status === "pending"
        },
        state: {
            errors
        }
    };
};