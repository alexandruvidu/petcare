import { FormController } from "../FormController";
import { UserUpdateDTO } from "@infrastructure/apis/client";

export interface UserUpdateFormModel {
    name: string;
    email: string;
    phone: string;
    password?: string; // Optional
    confirmPassword?: string; // Optional
}

export interface UserUpdateFormState {
    errors: any; // FieldErrorsImpl<DeepRequired<UserUpdateFormModel>>;
}

export interface UserUpdateFormActions {
    register: any; // UseFormRegister<UserUpdateFormModel>;
    handleSubmit: any; // UseFormHandleSubmit<UserUpdateFormModel>;
    submit: (data: UserUpdateFormModel) => void;
    control: any; // Control<UserUpdateFormModel>;
}

export interface UserUpdateFormComputed {
    isSubmitting: boolean;
}

export type UserUpdateFormController = FormController<UserUpdateFormState, UserUpdateFormActions, UserUpdateFormComputed>;

export type UserUpdateFormProps = {
    onSubmitSuccess?: () => void;
    initialData: { // UserDTO like structure
        name: string;
        email: string;
        phone: string;
    };
};