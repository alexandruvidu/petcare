import { PetFormController, PetFormModel, PetFormProps } from "./PetForm.types";
import { yupResolver } from "@hookform/resolvers/yup"; // yupResolver is correct here
import { useIntl } from "react-intl";
import * as yup from "yup";
import { useForm, FieldValues, Resolver } from "react-hook-form"; // CORRECTED: Import Resolver from react-hook-form
import { useAddPet, useUpdatePet } from "@infrastructure/apis/api-management";
import { useCallback, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import { PetAddDTO, PetUpdateDTO } from "@infrastructure/apis/client";
// petTypes import is not used in this controller, usually used in the form component itself.

const getDefaultValues = (initialData?: PetAddDTO & { id?: string }): PetFormModel => {
    return {
        name: initialData?.name || "",
        type: initialData?.type || "",
        breed: initialData?.breed || "",
        age: initialData?.age !== undefined ? initialData.age.toString() : "", // Ensure age is string for form
    };
};

// This function now returns the yup schema object
const getPetFormValidationSchema = (formatMessage: Function): yup.ObjectSchema<PetFormModel> => {
    return yup.object().shape({
        name: yup.string()
            .required(formatMessage({ id: "validation.required" }, { field: formatMessage({ id: "pet.name" }) })),
        type: yup.string()
            .required(formatMessage({ id: "validation.required" }, { field: formatMessage({ id: "pet.type" }) })),
        breed: yup.string()
            .required(formatMessage({ id: "validation.required" }, { field: formatMessage({ id: "pet.breed" }) })),
        age: yup.string() // Validate as string first, then transform/test as number
            .required(formatMessage({ id: "validation.required" }, { field: formatMessage({ id: "pet.age" }) }))
            .test(
                "is-valid-age",
                formatMessage({ id: "validation.ageRange" }),
                (value) => {
                    if (value === undefined || value === null || value === "") return true; // Allow empty to be caught by 'required'
                    const num = Number(value);
                    return !isNaN(num) && num >= 0 && num <= 100;
                }
            ),
    });
};

export const usePetFormController = (props: PetFormProps): PetFormController => {
    const { initialData, onSubmitSuccess } = props;
    const { formatMessage } = useIntl();

    const activeSchema = useMemo(() => getPetFormValidationSchema(formatMessage), [formatMessage]);
    const activeDefaultValues = useMemo(() => getDefaultValues(initialData), [initialData]);

    const { mutateAsync: addPet, status: addStatus } = useAddPet();
    const { mutateAsync: updatePet, status: updateStatus } = useUpdatePet();

    const isEditMode = useMemo(() => !!initialData?.id, [initialData]);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm<PetFormModel>({
        defaultValues: activeDefaultValues,
        resolver: yupResolver(activeSchema) as unknown as Resolver<PetFormModel, any>,
    });

    useEffect(() => {
        reset(getDefaultValues(initialData));
    }, [initialData, reset]);

    const submit = useCallback(async (data: PetFormModel) => {
        const ageAsNumber = Number(data.age);
        if (isNaN(ageAsNumber)) {
            toast.error(formatMessage({ id: "validation.ageRange" }));
            return;
        }

        const payload: PetAddDTO | PetUpdateDTO = {
            name: data.name,
            type: data.type,
            breed: data.breed,
            age: ageAsNumber,
        };

        try {
            if (isEditMode && initialData?.id) {
                await updatePet({ id: initialData.id, petUpdateDTO: payload as PetUpdateDTO });
                toast.success(formatMessage({ id: "success.petUpdated" }));
            } else {
                await addPet(payload as PetAddDTO);
                toast.success(formatMessage({ id: "success.petAdded" }));
            }
            reset(getDefaultValues());
            if (onSubmitSuccess) onSubmitSuccess();
        } catch (error: any) {
            const apiErrorMessage = error?.response?.data?.errorMessage?.message || error?.message;
            toast.error(apiErrorMessage || formatMessage({id: "error.defaultApi"}));
        }
    }, [isEditMode, initialData, addPet, updatePet, reset, onSubmitSuccess, formatMessage]);

    return {
        actions: { handleSubmit, submit, register, control },
        computed: {
            isSubmitting: addStatus === "pending" || updateStatus === "pending",
            isEditMode,
        },
        state: { errors }
    }
}