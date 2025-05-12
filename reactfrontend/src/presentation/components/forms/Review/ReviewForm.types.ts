import { FormController } from "../FormController";
import { ReviewAddDTO, ReviewDTO } from "@infrastructure/apis/client";

export interface ReviewFormModel {
    rating: number;
    comment: string;
}

export interface ReviewFormState {
    errors: any;
}

export interface ReviewFormActions {
    register: any;
    handleSubmit: any;
    submit: (data: ReviewFormModel) => void;
    control: any;
    setValue: (name: keyof ReviewFormModel, value: any, options?: Object) => void;
}

export interface ReviewFormComputed {
    isSubmitting: boolean;
    isEditMode: boolean;
}

export type ReviewFormController = FormController<ReviewFormState, ReviewFormActions, ReviewFormComputed>;

export type ReviewFormProps = {
    onSubmitSuccess?: () => void;
    bookingId: string; // To associate review with booking
    sitterId: string; // To associate review with sitter
    existingReview?: ReviewDTO; // For editing
};