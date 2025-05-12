import { FormController } from "../FormController";
import { Control } from "react-hook-form";
import { BookingAddDTO, BookingUpdateDTO, BookingStatusEnum, PetDTO, UserDTO, UserRoleEnum, BookingDTO } from "@infrastructure/apis/client";

// For creating a booking
export interface BookingAddFormModel {
    startDate: string; // ISO string or suitable for MUI DateTimePicker
    endDate: string;
    notes?: string;
    sitterId: string;
    petId: string;
}

// For updating a booking by Client
export interface BookingClientUpdateFormModel {
    startDate: string;
    endDate: string;
    notes?: string;
}

// For updating a booking by Sitter
export interface BookingSitterUpdateFormModel {
    status: BookingStatusEnum | '';
}

export type BookingFormModelUnion = BookingAddFormModel | BookingClientUpdateFormModel | BookingSitterUpdateFormModel;

export interface BookingFormState {
    errors: any;
}

export interface BookingFormActions {
    handleSubmit: any;
    submit: (data: BookingFormModelUnion) => void;
    control: Control<any>;
}

export interface BookingFormComputed {
    isSubmitting: boolean;
    isEditMode: boolean;
    isClientRole: boolean;
}

export type BookingFormController = FormController<BookingFormState, BookingFormActions, BookingFormComputed>;

export type BookingFormProps = {
    onSubmitSuccess?: () => void;
    // initialData is now BookingDTO if editing, or Partial<BookingAddFormModel> for pre-filling an add form
    initialData?: BookingDTO | Partial<BookingAddFormModel>;
    isEdit: boolean; // Explicitly pass if it's an edit operation
    availablePets?: PetDTO[];
    availableSitters?: UserDTO[];
    userRole: UserRoleEnum;
};