import { BookingFormController, BookingFormModel } from "./BookingForm.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import * as yup from "yup";
import { isUndefined } from "lodash";
import { useForm } from "react-hook-form";
import {
    useCreateBooking,
    useUpdateBooking,
    useGetMyPets,
    useGetAllSitters
} from "@infrastructure/apis/api-management";
import { useCallback, useEffect } from "react";
import { useAppSelector } from "@application/store";
import { UserRoleEnum } from "@infrastructure/apis/client";

const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format as YYYY-MM-DDThh:mm
};

/**
 * Default form values and validation schema
 */
const getDefaultValues = (initialData?: any) => {
    const defaultValues = {
        startDate: '',
        endDate: '',
        notes: '',
        status: '',
        sitterId: '',
        petId: ''
    };

    if (!isUndefined(initialData)) {
        return {
            ...defaultValues,
            startDate: formatDateForInput(initialData.startDate) || '',
            endDate: formatDateForInput(initialData.endDate) || '',
            notes: initialData.notes || '',
            status: initialData.status || '',
            sitterId: initialData.sitterId || '',
            petId: initialData.petId || ''
        };
    }

    return defaultValues;
};

/**
 * Form validation schema
 */
const useInitBookingForm = (booking?: any, userRole?: string) => {
    const { formatMessage } = useIntl();
    const defaultValues = getDefaultValues(booking);
    const isClient = userRole === UserRoleEnum.Client;
    const isSitter = userRole === UserRoleEnum.Sitter;
    const isEditing = !!booking;

    const schema = yup.object().shape({
        startDate: yup.string()
            .test({
                name: 'required-if-client',
                test: function (value) {
                    if (isClient && !isEditing) {
                        return !!value || this.createError({
                            message: formatMessage(
                                { id: "forms.validation.required" },
                                { fieldName: formatMessage({ id: "forms.fields.startDate" }) }
                            )
                        });
                    }
                    return true;
                }
            })
            .default(defaultValues.startDate),
        endDate: yup.string()
            .test({
                name: 'required-if-client',
                test: function (value) {
                    if (isClient && !isEditing) {
                        return !!value || this.createError({
                            message: formatMessage(
                                { id: "forms.validation.required" },
                                { fieldName: formatMessage({ id: "forms.fields.endDate" }) }
                            )
                        });
                    }
                    return true;
                }
            })
            .test({
                name: 'end-date-after-start-date',
                test: function (value) {
                    const startDate = this.parent.startDate;
                    if (isClient && startDate && value) {
                        return new Date(value) > new Date(startDate) || this.createError({
                            message: formatMessage({ id: "forms.validation.endDateAfterStartDate" })
                        });
                    }
                    return true;
                }
            })
            .default(defaultValues.endDate),
        notes: yup.string()
            .max(1000, formatMessage({ id: "forms.validation.maxLength" }, { max: 1000 }))
            .default(defaultValues.notes),
        status: yup.string()
            .test({
                name: 'required-if-sitter',
                test: function (value) {
                    if (isSitter && isEditing) {
                        return !!value || this.createError({
                            message: formatMessage(
                                { id: "forms.validation.required" },
                                { fieldName: formatMessage({ id: "forms.fields.status" }) }
                            )
                        });
                    }
                    return true;
                }
            })
            .default(defaultValues.status),
        sitterId: yup.string()
            .test({
                name: 'required-if-client-new',
                test: function (value) {
                    if (isClient && !isEditing) {
                        return !!value || this.createError({
                            message: formatMessage(
                                { id: "forms.validation.required" },
                                { fieldName: formatMessage({ id: "forms.fields.sitter" }) }
                            )
                        });
                    }
                    return true;
                }
            })
            .default(defaultValues.sitterId),
        petId: yup.string()
            .test({
                name: 'required-if-client-new',
                test: function (value) {
                    if (isClient && !isEditing) {
                        return !!value || this.createError({
                            message: formatMessage(
                                { id: "forms.validation.required" },
                                { fieldName: formatMessage({ id: "forms.fields.pet" }) }
                            )
                        });
                    }
                    return true;
                }
            })
            .default(defaultValues.petId),
    });

    const resolver = yupResolver(schema);

    return { defaultValues, resolver };
};

/**
 * Booking form controller hook
 */
export const useBookingFormController = (
    booking?: any,
    onSubmitSuccess?: () => void
): BookingFormController => {
    const { user } = useAppSelector(state => state.profileReducer);
    const userRole = user?.role;
    const isClient = userRole === UserRoleEnum.Client;
    const isSitter = userRole === UserRoleEnum.Sitter;

    const { defaultValues, resolver } = useInitBookingForm(booking, userRole);
    const { mutateAsync: createBooking, status: createStatus } = useCreateBooking();
    const { mutateAsync: updateBooking, status: updateStatus } = useUpdateBooking();
    const { data: petsData } = useGetMyPets();
    const { data: sittersData } = useGetAllSitters();

    const isEditing = !!booking;
    const isSubmitting = createStatus === "pending" || updateStatus === "pending";

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<BookingFormModel>({
        defaultValues,
        resolver
    });

    // Initialize form with booking data if in edit mode
    useEffect(() => {
        if (booking) {
            setValue('startDate', formatDateForInput(booking.startDate));
            setValue('endDate', formatDateForInput(booking.endDate));
            setValue('notes', booking.notes || '');
            setValue('status', booking.status || '');
            setValue('sitterId', booking.sitterId || '');
            setValue('petId', booking.petId || '');
        }
    }, [booking, setValue]);

    const submit = useCallback((data: BookingFormModel) => {
        const bookingData = { ...data };

        // Remove fields based on role and edit status
        if (isEditing) {
            if (isClient) {
                // Clients can update dates and notes
                delete bookingData.status;
                delete bookingData.sitterId;
                delete bookingData.petId;

                return updateBooking({
                    id: booking.id,
                    startDate: bookingData.startDate,
                    endDate: bookingData.endDate,
                    notes: bookingData.notes
                }).then(() => {
                    if (onSubmitSuccess) onSubmitSuccess();
                });
            } else if (isSitter) {
                // Sitters can only update status
                return updateBooking({
                    id: booking.id,
                    status: bookingData.status
                }).then(() => {
                    if (onSubmitSuccess) onSubmitSuccess();
                });
            }
        } else {
            return createBooking(bookingData).then(() => {
                if (onSubmitSuccess) onSubmitSuccess();
            });
        }
    }, [isEditing, isClient, isSitter, booking, createBooking, updateBooking, onSubmitSuccess]);

    return {
        actions: {
            handleSubmit,
            submit,
            register,
            watch,
            setValue
        },
        computed: {
            defaultValues,
            isSubmitting,
            isSitter,
            isClient,
            isEditing,
            pets: petsData || [],
            sitters: sittersData || []
        },
        state: {
            errors
        }
    };
};
