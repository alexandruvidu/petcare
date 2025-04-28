import { FormController } from "../FormController";
import {
    UseFormHandleSubmit,
    UseFormRegister,
    FieldErrorsImpl,
    DeepRequired,
    UseFormWatch
} from "react-hook-form";

export type PetFormModel = {
    name: string;
    type: string;
    breed: string;
    age: number;
};

export type PetFormState = {
    errors: FieldErrorsImpl<DeepRequired<PetFormModel>>;
};

export type PetFormActions = {
    register: UseFormRegister<PetFormModel>;
    watch: UseFormWatch<PetFormModel>;
    handleSubmit: UseFormHandleSubmit<PetFormModel>;
    submit: (body: PetFormModel) => void;
};

export type PetFormComputed = {
    defaultValues: PetFormModel,
    isSubmitting: boolean
};

export type PetFormController = FormController<PetFormState, PetFormActions, PetFormComputed>;
