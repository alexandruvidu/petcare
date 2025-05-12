import { ReviewFormController, ReviewFormModel, ReviewFormProps } from "./ReviewForm.types";
import { yupResolver } from "@hookform/resolvers/yup"; // Resolver should be imported from react-hook-form
import { useIntl } from "react-intl";
import * as yup from "yup";
import { useForm, Resolver } from "react-hook-form"; // Import Resolver from react-hook-form
import { useAddReview, useUpdateReview, useGetReviewByBooking } from "@infrastructure/apis/api-management";
import { useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { ReviewAddDTO, ReviewUpdateDTO, ReviewDTO, ErrorCodes } from "@infrastructure/apis/client"; // Added ErrorCodes

const getDefaultValues = (existingReview?: ReviewDTO | null): ReviewFormModel => ({ // Allow null here
    rating: existingReview?.rating || 0,
    comment: existingReview?.comment || "",
});

// Renamed to reflect it returns the schema object
const getReviewFormValidationSchema = (formatMessage: Function): yup.ObjectSchema<ReviewFormModel> => {
    return yup.object().shape({
        rating: yup.number()
            .min(1, formatMessage({ id: "validation.ratingMin" }, {min: 1}))
            .max(5, formatMessage({ id: "validation.ratingMax" }, {max: 5}))
            .required(formatMessage({ id: "validation.required" }, { field: formatMessage({ id: "labels.rating" }) })),
        comment: yup.string()
            .required(formatMessage({ id: "validation.required" }, { field: formatMessage({ id: "labels.comment" }) }))
            .max(1000, formatMessage({ id: "validation.maxLength" }, { max: 1000 })),
    });
};

export const useReviewFormController = (props: ReviewFormProps): ReviewFormController => {
    const { onSubmitSuccess, bookingId, sitterId, existingReview: passedExistingReview } = props;
    const { formatMessage } = useIntl();

    const { data: fetchedReviewData, isLoading: isLoadingExistingReview, refetch: refetchExistingReview } = useGetReviewByBooking(
        (!passedExistingReview && bookingId) ? bookingId : undefined // Only fetch if not passed AND bookingId is present
    );

    // Determine the existing review, prioritizing passed prop, then fetched data
    const currentExistingReview = useMemo(() => {
        return passedExistingReview || fetchedReviewData?.response || null;
    }, [passedExistingReview, fetchedReviewData]);

    const isEditMode = useMemo(() => !!currentExistingReview?.id, [currentExistingReview]);

    const schema = useMemo(() => getReviewFormValidationSchema(formatMessage), [formatMessage]);
    const defaultFormValues = useMemo(() => getDefaultValues(currentExistingReview), [currentExistingReview]);

    const { mutateAsync: addReview, status: addStatus } = useAddReview();
    const { mutateAsync: updateReview, status: updateStatus } = useUpdateReview();

    const { register, handleSubmit, control, reset, setValue, formState: { errors } } =
        useForm<ReviewFormModel>({
            defaultValues: defaultFormValues,
            resolver: yupResolver(schema) as unknown as Resolver<ReviewFormModel, any>, // Cast to handle yup's inferred type
        });

    useEffect(() => {
        // Reset form with appropriate defaults when the existing review context changes
        reset(getDefaultValues(currentExistingReview));
    }, [currentExistingReview, reset]);

    const submit = useCallback(async (data: ReviewFormModel) => {
        const payloadCommon = {
            rating: data.rating,
            comment: data.comment,
        };

        try {
            if (isEditMode && currentExistingReview?.id) {
                const payload: ReviewUpdateDTO = payloadCommon;
                await updateReview({ id: currentExistingReview.id, reviewUpdateDTO: payload });
                toast.success(formatMessage({ id: "success.reviewUpdated" }));
            } else {
                const payload: ReviewAddDTO = { ...payloadCommon, sitterId, bookingId };
                await addReview(payload);
                toast.success(formatMessage({ id: "success.reviewSubmitted" }));
            }
            if (onSubmitSuccess) onSubmitSuccess();
            // No need to reset here if onSubmitSuccess closes the modal or re-fetches.
            // If form stays open, reset to currentExistingReview's defaults after successful update:
            // if (isEditMode) reset(getDefaultValues(currentExistingReview)); else reset(getDefaultValues());
        } catch (error: any) {
            const apiErrorMessage = error?.response?.data?.errorMessage?.message || error?.message;
            toast.error(apiErrorMessage || formatMessage({ id: "error.defaultApi" }));
        }
    }, [isEditMode, currentExistingReview, addReview, updateReview, onSubmitSuccess, formatMessage, sitterId, bookingId, reset]);

    return {
        actions: { handleSubmit, submit, register, control, setValue },
        computed: {
            isSubmitting: addStatus === "pending" || updateStatus === "pending" || isLoadingExistingReview,
            isEditMode,
        },
        state: { errors },
    };
};