import {
    BookingFormController,
    BookingAddFormModel,
    BookingClientUpdateFormModel,
    BookingSitterUpdateFormModel,
    BookingFormProps,
    BookingFormModelUnion
} from "./BookingForm.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import * as yup from "yup";
import { useForm, FieldValues, Resolver, Path, UseFormProps } from "react-hook-form";
import { useCreateBooking, useUpdateBooking } from "@infrastructure/apis/api-management";
import { useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { BookingStatusEnum, UserRoleEnum, BookingUpdateDTO, BookingAddDTO, BookingDTO } from "@infrastructure/apis/client";

// Renaming this back to clearly indicate it calculates the initial defaults for a given mode.
const calculateActiveDefaultValues = (
    isEdit: boolean,
    userRole: UserRoleEnum,
    initialData?: BookingDTO | Partial<BookingAddFormModel>
): BookingFormModelUnion => {
    if (!isEdit && userRole === UserRoleEnum.Client) {
        const prefill = initialData as Partial<BookingAddFormModel> | undefined;
        return {
            startDate: prefill?.startDate || "",
            endDate: prefill?.endDate || "",
            notes: prefill?.notes || "",
            sitterId: prefill?.sitterId || "",
            petId: prefill?.petId || "",
        };
    } else if (isEdit && userRole === UserRoleEnum.Client) {
        const data = initialData as BookingDTO | undefined;
        return {
            startDate: data?.startDate ? new Date(data.startDate).toISOString().slice(0, 16) : "",
            endDate: data?.endDate ? new Date(data.endDate).toISOString().slice(0, 16) : "",
            notes: data?.notes || "",
        };
    } else if (isEdit && userRole === UserRoleEnum.Sitter) {
        const data = initialData as BookingDTO | undefined;
        return {
            status: data?.status || '',
        };
    }
    return { startDate: "", endDate: "", notes: "", sitterId: "", petId: "" }; // Fallback
};


const getActiveValidationSchemaObject = (isEdit: boolean, userRole: UserRoleEnum, formatMessage: Function): yup.ObjectSchema<any> => {
    const isClient = userRole === UserRoleEnum.Client;

    const commonDateShape = {
        startDate: yup.string().required(formatMessage({ id: "validation.required" }, { field: formatMessage({ id: "booking.startDate" }) })),
        endDate: yup.string().required(formatMessage({ id: "validation.required" }, { field: formatMessage({ id: "booking.endDate" }) }))
            .test('is-after-start', formatMessage({ id: "validation.endDateAfterStartDate" }), function (value) {
                const { startDate } = this.parent;
                return !startDate || !value || new Date(value) > new Date(startDate);
            }),
        notes: yup.string().nullable().optional().max(1000, formatMessage({ id: "validation.maxLength" }, { max: 1000 })),
    };

    if (!isEdit && isClient) {
        return yup.object().shape({
            ...commonDateShape,
            sitterId: yup.string().required(formatMessage({ id: "validation.required" }, { field: formatMessage({ id: "booking.selectSitter" }) })),
            petId: yup.string().required(formatMessage({ id: "validation.required" }, { field: formatMessage({ id: "booking.selectPet" }) })),
        });
    } else if (isEdit && isClient) {
        return yup.object().shape({
            startDate: commonDateShape.startDate,
            endDate: commonDateShape.endDate,
            notes: commonDateShape.notes,
        });
    } else if (isEdit && !isClient) {
        return yup.object().shape({
            status: yup.string()
                .oneOf(Object.values(BookingStatusEnum))
                .required(formatMessage({ id: "validation.required" }, { field: formatMessage({ id: "booking.status" }) })),
        });
    }
    return yup.object().shape({
        startDate: yup.string().optional(),
        endDate: yup.string().optional(),
        notes: yup.string().nullable().optional(),
        sitterId: yup.string().optional(),
        petId: yup.string().optional(),
        status: yup.string().optional(),
    });
};


export const useBookingFormController = (props: BookingFormProps): BookingFormController => {
    const { initialData, onSubmitSuccess, userRole, isEdit } = props;
    const { formatMessage } = useIntl();
    const isClientRole = userRole === UserRoleEnum.Client;

    const activeSchema = useMemo(() => getActiveValidationSchemaObject(isEdit, userRole, formatMessage), [isEdit, userRole, formatMessage]);
    // activeDefaultValues is now the source of truth for what the form *should* default to for the current mode
    const activeDefaultValues = useMemo(() => calculateActiveDefaultValues(isEdit, userRole, initialData), [isEdit, userRole, initialData]);

    const { mutateAsync: createBooking, status: createStatus } = useCreateBooking();
    const { mutateAsync: updateBooking, status: updateStatus } = useUpdateBooking();

    const formMethods = useForm<BookingFormModelUnion>({
        defaultValues: activeDefaultValues, // Initialize with the calculated defaults for the current mode
        resolver: yupResolver(activeSchema) as Resolver<BookingFormModelUnion, any>,
    });
    const { handleSubmit, control, reset, formState: { errors } } = formMethods;

    useEffect(() => {
        // When props change (e.g., modal reopens for different data/mode),
        // recalculate the defaults for THAT mode and reset the form.
        const newDefaultValuesForCurrentMode = calculateActiveDefaultValues(isEdit, userRole, initialData);
        reset(newDefaultValuesForCurrentMode);
    }, [initialData, isEdit, userRole, reset]);


    const submit = useCallback(async (data: BookingFormModelUnion) => {
        try {
            if (isEdit && initialData && 'id' in initialData) {
                const bookingId = (initialData as BookingDTO).id;
                let payload: Partial<BookingUpdateDTO> = {};
                if (isClientRole) {
                    const clientUpdateData = data as BookingClientUpdateFormModel;
                    payload = {
                        startDate: clientUpdateData.startDate ? new Date(clientUpdateData.startDate) : undefined,
                        endDate: clientUpdateData.endDate ? new Date(clientUpdateData.endDate) : undefined,
                        notes: clientUpdateData.notes,
                    };
                } else {
                    const sitterUpdateData = data as BookingSitterUpdateFormModel;
                    payload = { status: sitterUpdateData.status as BookingStatusEnum };
                }
                await updateBooking({ id: bookingId, bookingUpdateDTO: payload });
                toast.success(formatMessage({ id: "success.bookingUpdated" }));
            } else if (!isEdit && isClientRole) {
                const addData = data as BookingAddFormModel;
                const payload: BookingAddDTO = {
                    startDate: new Date(addData.startDate),
                    endDate: new Date(addData.endDate),
                    notes: addData.notes || "",
                    sitterId: addData.sitterId,
                    petId: addData.petId,
                };
                await createBooking(payload);
                toast.success(formatMessage({ id: "success.bookingCreated" }));
            }
            // Reset to the default values specific to the mode the form was just in.
            reset(calculateActiveDefaultValues(isEdit, userRole, initialData)); // Corrected: Call the function
            if (onSubmitSuccess) onSubmitSuccess();
        } catch (error: any) {
            const apiErrorMessage = error?.response?.data?.errorMessage?.message || error?.message;
            toast.error(apiErrorMessage || formatMessage({ id: "error.defaultApi" }));
        }
    }, [isEdit, initialData, createBooking, updateBooking, reset, onSubmitSuccess, formatMessage, isClientRole, userRole]);

    return {
        actions: { handleSubmit, submit, control },
        computed: {
            isSubmitting: createStatus === "pending" || updateStatus === "pending",
            isEditMode: isEdit,
            isClientRole,
        },
        state: { errors }
    };
};