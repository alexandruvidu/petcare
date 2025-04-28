import { RegisterFormController, RegisterFormModel } from "./RegisterForm.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import * as yup from "yup";
import { isUndefined } from "lodash";
import { useForm } from "react-hook-form";
import { useRegister } from "@infrastructure/apis/api-management";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AppRoute } from "../../../../routes";
import { SelectChangeEvent } from "@mui/material";
import { UserRoleEnum } from "@infrastructure/apis/client";

/**
 * Default form values and validation schema
 */
const getDefaultValues = (initialData?: Partial<RegisterFormModel>) => {
    const defaultValues = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        role: UserRoleEnum.Client
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
 * Form validation schema
 */
const useInitRegisterForm = () => {
    const { formatMessage } = useIntl();
    const defaultValues = getDefaultValues();

    const schema = yup.object().shape({
        name: yup.string()
            .required(formatMessage(
                { id: "forms.validation.required" },
                {
                    fieldName: formatMessage({ id: "forms.fields.name" }),
                }))
            .default(defaultValues.name),
        email: yup.string()
            .required(formatMessage(
                { id: "forms.validation.required" },
                {
                    fieldName: formatMessage({ id: "forms.fields.email" }),
                }))
            .email(formatMessage({ id: "forms.validation.email" }))
            .default(defaultValues.email),
        password: yup.string()
            .required(formatMessage(
                { id: "forms.validation.required" },
                {
                    fieldName: formatMessage({ id: "forms.fields.password" }),
                }))
            .min(6, formatMessage({ id: "forms.validation.passwordLength" }))
            .default(defaultValues.password),
        confirmPassword: yup.string()
            .required(formatMessage(
                { id: "forms.validation.required" },
                {
                    fieldName: formatMessage({ id: "forms.fields.confirmPassword" }),
                }))
            .oneOf(
                [yup.ref('password')],
                formatMessage({ id: "forms.validation.passwordMatch" })
            )
            .default(defaultValues.confirmPassword),
        phone: yup.string()
            .required(formatMessage(
                { id: "forms.validation.required" },
                {
                    fieldName: formatMessage({ id: "forms.fields.phone" }),
                }))
            .matches(/^\d{10}$/, formatMessage({ id: "forms.validation.phoneFormat" }))
            .default(defaultValues.phone),
        role: yup.string()
            .oneOf(
                [UserRoleEnum.Client, UserRoleEnum.Sitter],
                formatMessage({ id: "forms.validation.invalidRole" })
            )
            .required(formatMessage(
                { id: "forms.validation.required" },
                {
                    fieldName: formatMessage({ id: "forms.fields.role" }),
                }))
            .default(defaultValues.role)
    });

    const resolver = yupResolver(schema);

    return { defaultValues, resolver };
};

/**
 * Register form controller hook
 */
export const useRegisterFormController = (): RegisterFormController => {
    const { defaultValues, resolver } = useInitRegisterForm();
    const navigate = useNavigate();
    const { mutateAsync: register, status } = useRegister();

    const submit = useCallback((data: RegisterFormModel) =>
        register({
            name: data.name,
            email: data.email,
            password: data.password,
            phone: data.phone,
            role: data.role
        }).then((result) => {
            if (result?.user?.role === 'Client') {
                navigate(AppRoute.ClientDashboard);
            } else if (result?.user?.role === 'Sitter') {
                navigate(AppRoute.SitterDashboard);
            } else {
                navigate(AppRoute.Index);
            }
        }), [register, navigate]);

    const {
        register: registerField,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<RegisterFormModel>({
        defaultValues,
        resolver
    });

    const selectRole = useCallback((event: SelectChangeEvent<UserRoleEnum>) => {
        setValue("role", event.target.value as UserRoleEnum, {
            shouldValidate: true,
        });
    }, [setValue]);

    return {
        actions: {
            handleSubmit,
            submit,
            register: registerField,
            watch,
            selectRole
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
