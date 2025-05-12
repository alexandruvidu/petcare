import { FormController } from "../FormController";
import { SitterProfileDTO } from "@infrastructure/apis/client";

// Model for both add and update, update fields are optional in DTO
export interface SitterProfileFormModel {
    bio: string;
    yearsExperience: number | string; // String for input, number for submission
    hourlyRate: number | string;    // String for input, number for submission
    location: string;
}

export interface SitterProfileFormState {
    errors: any; // FieldErrorsImpl<DeepRequired<SitterProfileFormModel>>;
}

export interface SitterProfileFormActions {
    register: any; // UseFormRegister<SitterProfileFormModel>;
    handleSubmit: any; // UseFormHandleSubmit<SitterProfileFormModel>;
    submit: (data: SitterProfileFormModel) => void;
    control: any; // Control<SitterProfileFormModel>;
}

export interface SitterProfileFormComputed {
    isSubmitting: boolean;
    isEditMode: boolean; // True if a profile already exists and is being updated
}

export type SitterProfileFormController = FormController<SitterProfileFormState, SitterProfileFormActions, SitterProfileFormComputed>;

export type SitterProfileFormProps = {
    onSubmitSuccess?: () => void;
    initialData?: SitterProfileDTO; // SitterProfileDTO from API for editing
    hasExistingProfile: boolean; // To determine Add vs Update
};