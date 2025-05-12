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

export type UserAddFormModel = {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: UserRoleEnum | ''; // Crucial: Allows '' for the placeholder in the Select
};

export type UserAddFormState = {
    errors: FieldErrorsImpl<DeepRequired<UserAddFormModel>>;
};

export type UserAddFormActions = {
    register: UseFormRegister<UserAddFormModel>;
    watch: UseFormWatch<UserAddFormModel>;
    handleSubmit: UseFormHandleSubmit<UserAddFormModel>;
    submit: (body: UserAddFormModel) => void;
    selectRole: (event: SelectChangeEvent<UserRoleEnum | ''>) => void; // Event value can be ''
    control: Control<UserAddFormModel>; // Make sure this is present
};

export type UserAddFormComputed = {
    defaultValues: UserAddFormModel,
    isSubmitting: boolean
};

export type UserAddFormController = FormController<UserAddFormState, UserAddFormActions, UserAddFormComputed>;