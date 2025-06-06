import { useDialogController } from "../Dialog.controller";
import { useForm, Resolver, UseFormHandleSubmit } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useIntl } from "react-intl";
import { FeedbackFormModel, FeedbackType, ContactPreference } from "@presentation/components/forms/Feedback/FeedbackForm.types"; // Updated path
import { useAddFeedback } from "@infrastructure/apis/api-management";
import { toast } from "react-toastify";
import { useCallback } from "react";
import { FeedbackAddDTO, FeedbackTypeEnum as ApiFeedbackTypeEnum, ContactPreferenceEnum as ApiContactPreferenceEnum } from "@infrastructure/apis/client"; // Import API enums

export const useFeedbackDialogController = (onClose?: () => void) => {
    const { isOpen, open, close: closeDialog } = useDialogController();
    const { formatMessage } = useIntl();

    const { mutateAsync: addFeedback, status } = useAddFeedback();

    const schema = yup.object().shape({
        rating: yup.number().min(1, formatMessage({id: "validation.ratingMin"}, {min: 1})).max(5,  formatMessage({id: "validation.ratingMax"}, {max: 5})).required(formatMessage({id: "validation.ratingRequired"})),
        email: yup.string().email(formatMessage({ id: "globals.validations.emailInvalid" })).optional(),
        comment: yup.string()
            .required(formatMessage({ id: "validation.required" }, { field: formatMessage({ id: "feedback.commentLabel" }) }))
            .min(5, formatMessage({ id: "validation.minLength" }, { name: formatMessage({ id: "feedback.commentLabel" }), min: 5 }))
            .max(1000, formatMessage({ id: "validation.maxLength" }, { name: formatMessage({ id: "feedback.commentLabel" }), max: 1000 })),
        feedbackType: yup.string().oneOf(Object.values(FeedbackType), formatMessage({id: "validation.invalidSelection"})).required(formatMessage({ id: "validation.required" }, { field: formatMessage({ id: "feedback.feedbackTypeLabel" }) })),
        contactPreference: yup.string().oneOf(Object.values(ContactPreference), formatMessage({id: "validation.invalidSelection"})).required(formatMessage({ id: "validation.required" }, { field: formatMessage({ id: "feedback.contactPreferenceLabel" }) })),
        allowFollowUp: yup.boolean(),
    });

    const defaultFormValues: FeedbackFormModel = {
        rating: 0,
        comment: "",
        email: "",
        feedbackType: '', // Start with empty for placeholder
        contactPreference: '', // Start with empty for placeholder
        allowFollowUp: false
    };

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FeedbackFormModel>({
        resolver: yupResolver(schema) as unknown as Resolver<FeedbackFormModel, any>,
        defaultValues: defaultFormValues
    });

    const actualSubmitHandler = useCallback(async (data: FeedbackFormModel) => {
        try {
            const payload: FeedbackAddDTO = {
                rating: data.rating,
                comment: data.comment,
                email: data.email || undefined,
                feedbackType: data.feedbackType as ApiFeedbackTypeEnum,
                contactPreference: data.contactPreference as ApiContactPreferenceEnum,
                allowFollowUp: data.allowFollowUp || false,
            };
            await addFeedback(payload);
            toast.success(formatMessage({ id: "feedback.success" }));
            reset(defaultFormValues);
            closeDialog();
            if (onClose) onClose();
        } catch (err) {
            const e = err as any;
            if (e.response?.data?.errorMessage?.message) {
                toast.error(e.response.data.errorMessage.message);
            } else {
                toast.error(formatMessage({ id: "feedback.error" }));
            }
            console.error("Feedback submission error:", err);
        }
    }, [addFeedback, reset, closeDialog, formatMessage, onClose, defaultFormValues]);

    const handleOpen = () => {
        reset(defaultFormValues);
        open();
    }

    const handleClose = () => {
        reset(defaultFormValues);
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