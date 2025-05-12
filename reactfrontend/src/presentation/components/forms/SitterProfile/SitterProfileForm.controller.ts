import { SitterProfileFormController, SitterProfileFormModel, SitterProfileFormProps } from "./SitterProfileForm.types";
import { yupResolver } from "@hookform/resolvers/yup"; // yupResolver is correct
import { useIntl } from "react-intl";
import * as yup from "yup";
import { useForm, Resolver, FieldValues } from "react-hook-form"; // Import Resolver and FieldValues
import { useAddSitterProfile, useUpdateSitterProfile } from "@infrastructure/apis/api-management";
import { useCallback, useEffect, useMemo } from "react"; // Added useMemo
import { toast } from "react-toastify";
import { SitterProfileAddDTO, SitterProfileUpdateDTO, SitterProfileDTO } from "@infrastructure/apis/client";

const getDefaultValues = (initialData?: SitterProfileDTO): SitterProfileFormModel => ({
    bio: initialData?.bio || "",
    // Ensure these are strings for the form fields
    yearsExperience: initialData?.yearsExperience !== undefined ? initialData.yearsExperience.toString() : "",
    hourlyRate: initialData?.hourlyRate !== undefined ? initialData.hourlyRate.toString() : "",
    location: initialData?.location || "",
});

// Renamed to reflect it returns the schema object
const getSitterProfileFormValidationSchema = (formatMessage: Function): yup.ObjectSchema<SitterProfileFormModel> => {
    return yup.object().shape({
        bio: yup.string()
            .required(formatMessage({ id: "validation.required" }, { field: formatMessage({ id: "labels.bio" }) }))
            .max(1000, formatMessage({ id: "validation.maxLength" }, { max: 1000 })),
        yearsExperience: yup.string() // Validate as string from input
            .required(formatMessage({ id: "validation.required" }, { field: formatMessage({ id: "labels.yearsExperience" }) }))
            .test("is-valid-experience", formatMessage({id: "validation.numberInvalidRange"}, {min:0, max:100}), value => { // i18n: validation.numberInvalidRange
                if (value == null || value === "") return true; // Let required handle empty
                const num = Number(value);
                return !isNaN(num) && num >= 0 && num <= 100;
            }),
        hourlyRate: yup.string() // Validate as string from input
            .required(formatMessage({ id: "validation.required" }, { field: formatMessage({ id: "labels.hourlyRate" }) }))
            .test("is-valid-rate", formatMessage({id: "validation.numberInvalidRange"}, {min:0, max:1000}), value => { // i18n
                if (value == null || value === "") return true; // Let required handle empty
                const num = Number(value);
                return !isNaN(num) && num >= 0 && num <= 1000;
            }),
        location: yup.string()
            .required(formatMessage({ id: "validation.required" }, { field: formatMessage({ id: "labels.location" }) }))
            .max(200, formatMessage({ id: "validation.maxLength" }, { max: 200 })),
    });
};

export const useSitterProfileFormController = (props: SitterProfileFormProps): SitterProfileFormController => {
    const { initialData, onSubmitSuccess, hasExistingProfile } = props;
    const { formatMessage } = useIntl();

    const activeSchema = useMemo(() => getSitterProfileFormValidationSchema(formatMessage), [formatMessage]);
    const activeDefaultValues = useMemo(() => getDefaultValues(initialData), [initialData]);

    const { mutateAsync: addProfile, status: addStatus } = useAddSitterProfile();
    const { mutateAsync: updateProfile, status: updateStatus } = useUpdateSitterProfile();

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<SitterProfileFormModel>({
        defaultValues: activeDefaultValues,
        resolver: yupResolver(activeSchema) as unknown as Resolver<SitterProfileFormModel, any>, // Cast resolver
    });

    useEffect(() => {
        reset(getDefaultValues(initialData));
    }, [initialData, hasExistingProfile, reset]); // hasExistingProfile ensures reset if mode changes

    const submit = useCallback(async (data: SitterProfileFormModel) => {
        // Convert string inputs to numbers for the payload
        const yearsExperienceNum = Number(data.yearsExperience);
        const hourlyRateNum = Number(data.hourlyRate);

        // Additional validation just in case yup string to number conversion isn't perfect for edge cases
        if (isNaN(yearsExperienceNum) || isNaN(hourlyRateNum)) {
            toast.error(formatMessage({ id: "validation.numberInvalid"}));
            return;
        }

        const payload: SitterProfileAddDTO | SitterProfileUpdateDTO = {
            bio: data.bio,
            yearsExperience: yearsExperienceNum,
            hourlyRate: hourlyRateNum,
            location: data.location,
        };
        try {
            if (hasExistingProfile) {
                await updateProfile(payload as SitterProfileUpdateDTO);
                toast.success(formatMessage({ id: "success.profileUpdate" }));
            } else {
                await addProfile(payload as SitterProfileAddDTO);
                toast.success(formatMessage({ id: "success.profileCreated" }));
            }
            if (onSubmitSuccess) onSubmitSuccess();
        } catch (error: any) {
            const apiErrorMessage = error?.response?.data?.errorMessage?.message || error?.message;
            toast.error(apiErrorMessage || formatMessage({ id: "error.defaultApi" }));
        }
    }, [addProfile, updateProfile, onSubmitSuccess, formatMessage, hasExistingProfile]);

    return {
        actions: { handleSubmit, submit, register, control },
        computed: {
            isSubmitting: addStatus === "pending" || updateStatus === "pending",
            isEditMode: hasExistingProfile,
        },
        state: { errors },
    };
};