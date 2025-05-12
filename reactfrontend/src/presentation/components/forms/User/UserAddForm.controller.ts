import { UserAddFormController, UserAddFormModel } from "./UserAddForm.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import * as yup from "yup";
import { useForm, Resolver, FieldValues } from "react-hook-form";
import { useAddUser } from "@infrastructure/apis/api-management";
import { useCallback } from "react";
import { UserRoleEnum, UserAddDTO, ErrorCodes } from "@infrastructure/apis/client";
import { SelectChangeEvent } from "@mui/material";
import { toast } from "react-toastify";

const getDefaultValues = (initialData?: Partial<UserAddFormModel>): UserAddFormModel => {
    const defaultValues: UserAddFormModel = {
        email: "",
        name: "",
        password: "",
        role: '', // Initialize with empty string for placeholder for the Select component
        phone: "",
    };
    return { ...defaultValues, ...initialData };
};

const getUserAddFormValidationSchema = (formatMessage: Function): yup.ObjectSchema<UserAddFormModel> => {
    return yup.object().shape({
        name: yup.string()
            .required(formatMessage({ id: "globals.validations.requiredField" }, { fieldName: formatMessage({id: "globals.name"}) })),
        email: yup.string()
            .email(formatMessage({ id: "globals.validations.emailInvalid" }))
            .required(formatMessage({ id: "globals.validations.requiredField" }, { fieldName: formatMessage({id: "globals.email"}) })),
        password: yup.string()
            .min(6, formatMessage({id: "globals.validations.passwordTooShort"}))
            .required(formatMessage({ id: "globals.validations.requiredField" }, { fieldName: formatMessage({id: "globals.password"}) })),
        phone: yup.string()
            .matches(/^\d{10}$/, formatMessage({ id: "globals.validations.phoneInvalid" }))
            .required(formatMessage({ id: "globals.validations.requiredField" }, { fieldName: formatMessage({id: "globals.phone"}) })),
        role: yup.string() // Validate as string initially
            .oneOf(Object.values(UserRoleEnum), formatMessage({id: "validation.invalidRole"})) // Ensures it's one of the enum string values
            .required(formatMessage({ id: "globals.validations.requiredField" }, { fieldName: formatMessage({id: "globals.role"}) }))
        // The `.test()` was causing TS2367 because after `oneOf(Object.values(UserRoleEnum))`, yup already refines the type.
        // The `required` should be enough if the initial value in the form model is `''`.
        // If the select allows `''` as a value, and the form model has `role: UserRoleEnum | ''`,
        // then `required` will make sure it's not `''` (or `null`/`undefined`).
        // The `oneOf` ensures it's a valid enum member if it's not empty.
    });
};

export const useUserAddFormController = (onSubmit?: () => void): UserAddFormController => {
    const { formatMessage } = useIntl();
    const schema = getUserAddFormValidationSchema(formatMessage);
    const defaultValues = getDefaultValues();

    const { mutateAsync: addUserMutation, status } = useAddUser();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors }
    } = useForm<UserAddFormModel>({
        defaultValues, // `role` is initially `''`
        resolver: yupResolver(schema) as unknown as Resolver<UserAddFormModel, any>,
    });

    const submit = useCallback(async (data: UserAddFormModel) => {
        // After yup validation (required and oneOf), data.role should be a valid UserRoleEnum string.
        // The only way it could be '' here is if yup validation somehow passed an empty string,
        // which .required() should prevent for string schemas.
        if (!data.role || !Object.values(UserRoleEnum).includes(data.role as UserRoleEnum)) {
            // This is a defensive check, yup should have caught this.
            toast.error(formatMessage({ id: "globals.validations.requiredField" }, { fieldName: formatMessage({ id: "globals.role" }) }));
            return;
        }

        const apiPayload: UserAddDTO = {
            name: data.name,
            email: data.email,
            password: data.password,
            phone: data.phone,
            role: data.role as UserRoleEnum, // Now safe to cast
        };

        try {
            await addUserMutation(apiPayload);
            toast.success(formatMessage({ id: "admin.users.addSuccess" }, { userName: data.name }));
            if (onSubmit) {
                onSubmit();
            }
        } catch (error: any) {
            const apiErrorMessage = error?.response?.data?.errorMessage;
            const specificError = apiErrorMessage?.code === ErrorCodes.AlreadyExists ? formatMessage({id: "notifications.errors.userAlreadyExists"}) : apiErrorMessage?.message || error?.message;
            toast.error(specificError || formatMessage({ id: "error.defaultApi" }));
        }
    }, [addUserMutation, onSubmit, formatMessage]);

    const selectRole = useCallback((event: SelectChangeEvent<UserRoleEnum | ''>) => {
        const value = event.target.value;
        // `UserAddFormModel.role` is `UserRoleEnum | ''`, so this assignment is fine.
        setValue("role", value as (UserRoleEnum | ''), {
            shouldValidate: true,
        });
    }, [setValue]);

    return {
        actions: { handleSubmit, submit, register, watch, selectRole, control },
        computed: { defaultValues, isSubmitting: status === "pending" },
        state: { errors }
    }
}