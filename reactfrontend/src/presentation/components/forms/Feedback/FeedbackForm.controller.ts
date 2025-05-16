import { useDialogController } from "../../ui/Dialogs/Dialog.controller"; // Corrected path
import { useForm, Resolver, UseFormHandleSubmit } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useIntl } from "react-intl";
import { FeedbackFormModel, FeedbackType, ContactPreference } from "./FeedbackForm.types";
import { useAddFeedback } from "@infrastructure/apis/api-management";
import { toast } from "react-toastify";
import { useCallback } from "react";
import { FeedbackAddDTO } from "@infrastructure/apis/client";


export const useFeedbackDialogController = (onClose?: () => void) => {
    const { isOpen, open, close: closeDialog } = useDialogController();
    const { formatMessage } = useIntl();

    const { mutateAsync: addFeedback, status } = useAddFeedback();

    const schema = yup.object().shape({
        rating: yup.number().min(1, formatMessage({id: "validation.ratingMin"}, {min: 1})).max(5,  formatMessage({id: "validation.ratingMax"}, {max: 5})).required(formatMessage({id: "validation.ratingRequired"})),
        comment: yup.string()
            .required(formatMessage({ id: "validation.required" }, { field: formatMessage({ id: "feedback.commentLabel" }) }))
            .min(5, formatMessage({ id: "validation.minLength" }, { name: formatMessage({ id: "feedback.commentLabel" }), min: 5 })) // ADDED MIN LENGTH
            .max(1000, formatMessage({ id: "validation.maxLength" }, { name: formatMessage({ id: "feedback.commentLabel" }), max: 1000 })), // Optional: pass field name to maxLength too
        email: yup.string().email(formatMessage({ id: "globals.validations.emailInvalid" })).optional(),
        feedbackType: yup.string()
            .oneOf(Object.values(FeedbackType), formatMessage({id: "validation.invalidSelection"}))
            .required(formatMessage({ id: "validation.required" }, { field: formatMessage({ id: "feedback.feedbackTypeLabel" }) })),
        contactPreference: yup.string()
            .oneOf(Object.values(ContactPreference), formatMessage({id: "validation.invalidSelection"}))
            .required(formatMessage({ id: "validation.required" }, { field: formatMessage({ id: "feedback.contactPreferenceLabel" }) })),
        allowFollowUp: yup.boolean(),
    });

    const defaultValues: FeedbackFormModel = {
        rating: 0,
        comment: "",
        email: "",
        feedbackType: '',
        contactPreference: '',
        allowFollowUp: false,
    };

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FeedbackFormModel>({
        resolver: yupResolver(schema) as unknown as Resolver<FeedbackFormModel, any>,
        defaultValues: defaultValues
    });

    const actualSubmitHandler = useCallback(async (data: FeedbackFormModel) => {
        try {
            const payload: FeedbackAddDTO = {
                rating: data.rating,
                comment: data.comment,
                email: data.email || undefined,
                feedbackType: data.feedbackType as FeedbackType,
                contactPreference: data.contactPreference as ContactPreference,
                allowFollowUp: data.allowFollowUp,
            };

            await addFeedback(payload as FeedbackAddDTO);
            toast.success(formatMessage({ id: "feedback.success" }));
            reset(defaultValues);
            closeDialog();
            if (onClose) onClose();
        } catch (err) {
            toast.error(formatMessage({ id: "feedback.error" }));
            console.error("Feedback submission error:", err);
        }
    }, [addFeedback, reset, closeDialog, formatMessage, onClose, defaultValues]);

    const handleOpen = () => {
        reset(defaultValues);
        open();
    }

    const handleClose = () => {
        reset(defaultValues);
        closeDialog();
        if (onClose) onClose();
    }

    return {
        isOpen,
        open: handleOpen,
        close: handleClose,
        control,
        handleSubmitFromController: handleSubmit,
        onValidSubmit: actualSubmitHandler,
        errors,
        isSubmitting: status === "pending"
    };
};