import { useDialogController } from "../Dialog.controller";
import { useForm, Resolver, UseFormHandleSubmit } from "react-hook-form"; // Added UseFormHandleSubmit
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useIntl } from "react-intl";
import { FeedbackFormModel } from "../../../forms/Feedback/FeedbackForm.types";
import { useAddFeedback } from "@infrastructure/apis/api-management";
import { toast } from "react-toastify";
import { useCallback } from "react";

export const useFeedbackDialogController = (onClose?: () => void) => {
    const { isOpen, open, close: closeDialog } = useDialogController();
    const { formatMessage } = useIntl();

    const { mutateAsync: addFeedback, status } = useAddFeedback();

    const schema = yup.object().shape({
        rating: yup.number().min(1, formatMessage({id: "validation.ratingMin"}, {min: 1})).max(5,  formatMessage({id: "validation.ratingMax"}, {max: 5})).required(formatMessage({id: "validation.ratingMin"}, {min: 1})),
        comment: yup.string().required(formatMessage({ id: "validation.required" }, { field: formatMessage({ id: "feedback.commentLabel" }) })).max(1000, formatMessage({ id: "validation.maxLength" }, {max: 1000})),
        email: yup.string().email(formatMessage({ id: "globals.validations.emailInvalid" })).optional(),
    });

    const {
        control,
        handleSubmit, // This is the react-hook-form handleSubmit
        reset,
        formState: { errors }
    } = useForm<FeedbackFormModel>({
        resolver: yupResolver(schema) as unknown as Resolver<FeedbackFormModel, any>,
        defaultValues: { rating: 0, comment: "", email: "" }
    });

    // This is your actual logic function
    const actualSubmitHandler = useCallback(async (data: FeedbackFormModel) => {
        try {
            await addFeedback({
                rating: data.rating,
                comment: data.comment,
                email: data.email || undefined
            });
            toast.success(formatMessage({ id: "feedback.success" }));
            reset({ rating: 0, comment: "", email: "" });
            closeDialog();
            if (onClose) onClose();
        } catch (err) {
            toast.error(formatMessage({ id: "feedback.error" }));
            console.error("Feedback submission error:", err);
        }
    }, [addFeedback, reset, closeDialog, formatMessage, onClose]);

    const handleOpen = () => {
        reset({ rating: 0, comment: "", email: "" });
        open();
    }

    const handleClose = () => {
        reset({ rating: 0, comment: "", email: ""});
        closeDialog();
        if (onClose) onClose();
    }

    return {
        isOpen,
        open: handleOpen,
        close: handleClose,
        control,
        handleSubmitFromController: handleSubmit, // Expose react-hook-form's handleSubmit
        onValidSubmit: actualSubmitHandler,     // Expose your custom logic handler
        errors,
        isSubmitting: status === "pending"
    };
};