import { FormController } from "../FormController";
import {
    UseFormHandleSubmit,
    UseFormRegister,
    FieldErrorsImpl,
    DeepRequired,
    UseFormWatch
} from "react-hook-form";
import { SelectChangeEvent } from "@mui/material";
import { UserRoleEnum } from "@infrastructure/apis/client";

export type RegisterFormModel = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    role: UserRoleEnum;
};

export type RegisterFormState = {
    errors: FieldErrorsImpl<DeepRequired<RegisterFormModel>>;
};

export type RegisterFormActions = {
    register: UseFormRegister<RegisterFormModel>;
    watch: UseFormWatch<RegisterFormModel>;
    handleSubmit: UseFormHandleSubmit<RegisterFormModel>;
    submit: (body: RegisterFormModel) => void;
    selectRole: (value: SelectChangeEvent<UserRoleEnum>) => void;
};

export type RegisterFormComputed = {
    defaultValues: RegisterFormModel,
    isSubmitting: boolean
};

export type RegisterFormController = FormController<RegisterFormState, RegisterFormActions, RegisterFormComputed>;
