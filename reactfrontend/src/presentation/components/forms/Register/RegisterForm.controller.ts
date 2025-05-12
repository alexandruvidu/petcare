import { RegisterFormController, RegisterFormModel } from "./RegisterForm.types";
import { yupResolver } from "@hookform/resolvers/yup"; // yupResolver is correct here
import { useIntl } from "react-intl";
import * as yup from "yup";
import { useForm, FieldValues, Resolver } from "react-hook-form"; // CORRECTED: Import Resolver from react-hook-form
import { useRegister } from "@infrastructure/apis/api-management";
import { useCallback } from "react";
import { UserRoleEnum, ErrorCodes } from "@infrastructure/apis/client"; // Added ErrorCodes
import { useAppDispatch } from "@application/store";
import { setToken } from "@application/state-slices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppRoute } from "routes";

const getDefaultValues = (initialData?: Partial<RegisterFormModel>): RegisterFormModel => {
    const defaultValues: RegisterFormModel = {
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: '' // Default to empty string for placeholder in Select
    };
    return { ...defaultValues, ...initialData };
};

const useInitRegisterFormSchema = () => {
    const { formatMessage } = useIntl();

    const allowedRegistrationRoles = [UserRoleEnum.Client, UserRoleEnum.Sitter] as const;
    type AllowedRegistrationRole = typeof allowedRegistrationRoles[number];

    const schema: yup.ObjectSchema<RegisterFormModel> = yup.object().shape({
        name: yup.string()
            .required(formatMessage({ id: "globals.validations.requiredField" }, { fieldName: formatMessage({ id: "globals.name" }) })),
        email: yup.string()
            .email(formatMessage({ id: "globals.validations.emailInvalid" }))
            .required(formatMessage({ id: "globals.validations.requiredField" }, { fieldName: formatMessage({ id: "globals.email" }) })),
        phone: yup.string()
            .matches(/^\d{10}$/, formatMessage({ id: "globals.validations.phoneInvalid" }))
            .required(formatMessage({ id: "globals.validations.requiredField" }, { fieldName: formatMessage({ id: "globals.phone" }) })),
        password: yup.string()
            .min(6, formatMessage({ id: "globals.validations.passwordTooShort" }))
            .required(formatMessage({ id: "globals.validations.requiredField" }, { fieldName: formatMessage({ id: "globals.password" }) })),
        confirmPassword: yup.string()
            .oneOf([yup.ref('password')], formatMessage({ id: "globals.validations.passwordsDoNotMatch" }))
            .required(formatMessage({ id: "globals.validations.requiredField" }, { fieldName: formatMessage({ id: "globals.confirmPassword" }) })),
        role: yup.mixed<AllowedRegistrationRole | ''>()
            .oneOf([...allowedRegistrationRoles, ''], formatMessage({id: "validation.invalidRole"})) // Keep empty string for initial placeholder compatibility
            .required(formatMessage({ id: "globals.validations.requiredField" }, { fieldName: formatMessage({ id: "labels.accountType" }) }))
            .test(
                "role-not-empty",
                formatMessage({ id: "globals.validations.requiredField" }, { fieldName: formatMessage({ id: "labels.accountType" }) }),
                value => value !== '' // Ensure an actual role is selected
            )
    });

    return schema;
}

export const useRegisterFormController = (): RegisterFormController => {
    const { formatMessage } = useIntl();
    const schema = useInitRegisterFormSchema();
    const defaultValues = getDefaultValues();

    const { mutateAsync: registerUser, status } = useRegister();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<RegisterFormModel>({
        defaultValues,
        resolver: yupResolver(schema) as unknown as Resolver<RegisterFormModel, any>, // Cast for dynamic schema
    });

    const submit = useCallback(async (data: RegisterFormModel) => {
        if (!data.role || (data.role !== UserRoleEnum.Client && data.role !== UserRoleEnum.Sitter)) {
            toast.error(formatMessage({ id: "globals.validations.requiredField" }, { fieldName: formatMessage({ id: "labels.accountType" }) }));
            return;
        }
        const apiData = {
            name: data.name,
            email: data.email,
            password: data.password, // Assuming backend hashes this
            phone: data.phone,
            role: data.role as UserRoleEnum
        };
        try {
            const result = await registerUser(apiData);
            if (result.response?.token && result.response?.user) {
                dispatch(setToken(result.response.token));
                localStorage.setItem('user', JSON.stringify(result.response.user));
                window.dispatchEvent(new Event('login'));
                toast.success(formatMessage({ id: "notifications.messages.registrationSuccess" }));

                if (result.response.user.role === UserRoleEnum.Client) {
                    navigate(AppRoute.ClientDashboard);
                } else if (result.response.user.role === UserRoleEnum.Sitter) {
                    navigate(AppRoute.SitterDashboard);
                } else {
                    navigate(AppRoute.Index);
                }
            } else if (result.errorMessage) {
                const specificError = result.errorMessage.code === ErrorCodes.AlreadyExists ? formatMessage({id: "notifications.errors.userAlreadyExists"}) : result.errorMessage.message;
                toast.error(`${formatMessage({ id: "notifications.errors.registrationFailed" })}: ${specificError}`);
            } else {
                toast.error(formatMessage({ id: "notifications.errors.registrationFailed" }));
            }
        } catch (error: any) {
            const apiErrorMessage = error?.response?.data?.errorMessage;
            const specificError = apiErrorMessage?.code === ErrorCodes.AlreadyExists ? formatMessage({id: "notifications.errors.userAlreadyExists"}) : apiErrorMessage?.message || error?.message;
            toast.error(specificError || formatMessage({ id: "notifications.errors.registrationFailed" }));
        }
    }, [registerUser, dispatch, navigate, formatMessage]);

    return {
        actions: { handleSubmit, submit, register, control },
        computed: { defaultValues, isSubmitting: status === "pending" },
        state: { errors }
    }
}