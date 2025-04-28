import { FormController } from "../FormController";
import {
    UseFormHandleSubmit,
    UseFormRegister,
    FieldErrorsImpl,
    DeepRequired,
    UseFormWatch,
    UseFormSetValue
} from "react-hook-form";

export type BookingFormModel = {
    startDate: string;
    endDate: string;
    notes: string;
    status?: string;
    sitterId?: string;
    petId?: string;
};

export type BookingFormState = {
    errors: FieldErrorsImpl<DeepRequired<BookingFormModel>>;
};

export type BookingFormActions = {
    register: UseFormRegister<BookingFormModel>;
    watch: UseFormWatch<BookingFormModel>;
    setValue: UseFormSetValue<BookingFormModel>;
    handleSubmit: UseFormHandleSubmit<BookingFormModel>;
    submit: (body: BookingFormModel) => void;
};

export type BookingFormComputed = {
    defaultValues: BookingFormModel,
    isSubmitting: boolean,
    isSitter: boolean,
    isClient: boolean,
    isEditing: boolean,
    pets: any[],
    sitters: any[]
};

export type BookingFormController = FormController<BookingFormState, BookingFormActions, BookingFormComputed>;
