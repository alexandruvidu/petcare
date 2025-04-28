import { PetFormController, PetFormModel } from "./PetForm.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import * as yup from "yup";
import { isUndefined } from "lodash";
import { useForm } from "react-hook-form";
import { useAddPet, useUpdatePet } from "@infrastructure/apis/api-management";
import { useCallback } from "react";

/**
 * Default form values and validation schema
 */
const getDefaultValues = (initialData?: PetFormModel) => {
    const defaultValues = {
        name: "",
        type: "",
        breed: "",
        age: 0
    };

    if (!isUndefined(initialData)) {
        return {
            ...defaultValues,
            ...initialData,
        };
    }

    return defaultValues;
};

/**
 * Form validation schema
 */
const useInitPetForm = (pet?: PetFormModel) => {
    const { formatMessage } = useIntl();
    const defaultValues = getDefaultValues(pet);

    const schema = yup.object().shape({
        name: yup.string()
            .required(formatMessage(
                { id: "forms.validation.required" },
                {
                    fieldName: formatMessage({ id: "forms.fields.name" }),
                }))
            .default(defaultValues.name),
        type: yup.string()
            .required(formatMessage(
                { id: "forms.validation.required" },
                {
                    fieldName: formatMessage({ id: "forms.fields.petType" }),
                }))
            .default(defaultValues.type),
        breed: yup.string()
            .required(formatMessage(
                { id: "forms.validation.required" },
                {
                    fieldName: formatMessage({ id: "forms.fields.breed" }),
                }))
            .default(defaultValues.breed),
        age: yup.number()
            .required(formatMessage(
                { id: "forms.validation.required" },
                {
                    fieldName: formatMessage({ id: "forms.fields.age" }),
                }))
            .min(0, formatMessage({ id: "forms.validation.positiveNumber" }))
            .max(100, formatMessage({ id: "forms.validation.maxAge" }))
            .default(defaultValues.age),
    });

    const resolver = yupResolver(schema);

    return { defaultValues, resolver };
};

/**
 * Pet form controller hook
 */
export const usePetFormController = (
    pet?: { id: string } & PetFormModel,
    onSubmitSuccess?: () => void
): PetFormController => {
    const { defaultValues, resolver } = useInitPetForm(pet);
    const { mutateAsync: addPet, status: addStatus } = useAddPet();
    const { mutateAsync: updatePet, status: updateStatus } = useUpdatePet();

    const isSubmitting = addStatus === "pending" || updateStatus === "pending";

    const submit = useCallback((data: PetFormModel) => {
        const action = pet
            ? updatePet({ id: pet.id, ...data })
            : addPet(data);

        return action.then(() => {
            if (onSubmitSuccess) {
                onSubmitSuccess();
            }
        });
    }, [pet, addPet, updatePet, onSubmitSuccess]);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<PetFormModel>({
        defaultValues,
        resolver
    });

    return {
        actions: {
            handleSubmit,
            submit,
            register,
            watch
        },
        computed: {
            defaultValues,
            isSubmitting
        },
        state: {
            errors
        }
    };
};
