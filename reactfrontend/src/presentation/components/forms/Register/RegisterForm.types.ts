import { UserRoleEnum } from "@infrastructure/apis/client";
import { FormController } from "../FormController";
import {
    UseFormHandleSubmit,
    UseFormRegister,
    FieldErrorsImpl,
    DeepRequired,
    UseFormWatch,
    Control
} from "react-hook-form";
import { SelectChangeEvent } from "@mui/material";

export interface RegisterFormModel {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    role: UserRoleEnum | ''; // Allow empty for placeholder
}

export interface RegisterFormState {
    errors: FieldErrorsImpl<DeepRequired<RegisterFormModel>>;
}

export interface RegisterFormActions {
    register: UseFormRegister<RegisterFormModel>;
    handleSubmit: UseFormHandleSubmit<RegisterFormModel>;
    submit: (body: RegisterFormModel) => void;
    control: Control<RegisterFormModel>; // For controlled MUI components like Select
}
export interface RegisterFormComputed {
    defaultValues: RegisterFormModel,
    isSubmitting: boolean;
}

export type RegisterFormController = FormController<RegisterFormState, RegisterFormActions, RegisterFormComputed>;