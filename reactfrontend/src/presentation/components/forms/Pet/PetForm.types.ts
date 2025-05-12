import { FormController } from "../FormController";
import {
    UseFormHandleSubmit,
    UseFormRegister,
    FieldErrorsImpl,
    DeepRequired,
    Control
} from "react-hook-form";
import { PetAddDTO, PetUpdateDTO } from "@infrastructure/apis/client";

export interface PetFormModel {
    name: string;
    type: string; // Could be an enum if types are fixed
    breed: string;
    age: number | string; // String for input, number for submission
}

export interface PetFormState {
    errors: FieldErrorsImpl<DeepRequired<PetFormModel>>;
}

export interface PetFormActions {
    register: UseFormRegister<PetFormModel>;
    handleSubmit: UseFormHandleSubmit<PetFormModel>;
    submit: (data: PetFormModel) => void;
    control: Control<PetFormModel>;
}

export interface PetFormComputed {
    isSubmitting: boolean;
    isEditMode: boolean;
}

export type PetFormController = FormController<PetFormState, PetFormActions, PetFormComputed>;

export type PetFormProps = {
    onSubmitSuccess?: () => void; // Callback on successful submission
    initialData?: PetAddDTO & { id?: string }; // For editing
};