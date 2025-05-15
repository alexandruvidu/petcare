import { UserRoleEnum } from "@infrastructure/apis/client";
import { FormController } from "../FormController";
import {
    UseFormHandleSubmit,
    UseFormRegister,
    FieldErrorsImpl,
    DeepRequired,
    UseFormWatch, // Keep watch if you need to observe changes outside of render
    Control,
    UseFormSetValue // Added UseFormSetValue
} from "react-hook-form";
// SelectChangeEvent is no longer needed for role

export interface RegisterFormModel {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    role: UserRoleEnum | ''; // Allow empty for placeholder/no selection
}

export interface RegisterFormState {
    errors: FieldErrorsImpl<DeepRequired<RegisterFormModel>>;
}

export interface RegisterFormActions {
    register: UseFormRegister<RegisterFormModel>;
    handleSubmit: UseFormHandleSubmit<RegisterFormModel>;
    submit: (body: RegisterFormModel) => void;
    control: Control<RegisterFormModel>;
    setValue: UseFormSetValue<RegisterFormModel>; // Add setValue
}
export interface RegisterFormComputed {
    defaultValues: RegisterFormModel,
    isSubmitting: boolean;
}

export type RegisterFormController = FormController<RegisterFormState, RegisterFormActions, RegisterFormComputed>;