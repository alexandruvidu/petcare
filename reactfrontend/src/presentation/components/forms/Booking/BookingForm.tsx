import React from 'react';
import {
    TextField, Button, Box, MenuItem, FormControl, InputLabel, Select, Grid, CircularProgress, Typography,
    FormHelperText
} from '@mui/material';
import { useIntl, FormattedMessage } from 'react-intl';
import { BookingFormProps } from "./BookingForm.types";
import { useBookingFormController } from "./BookingForm.controller";
import { Controller } from "react-hook-form";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { enUS, Locale, ro } from 'date-fns/locale';
import { BookingStatusEnum } from '@infrastructure/apis/client';

const localeMap: { [key: string]: Locale } = {
    en: enUS,
    ro: ro,
};

export const BookingForm: React.FC<BookingFormProps> = (props) => {
    const { formatMessage, locale } = useIntl();
    const { state, actions, computed } = useBookingFormController(props);
    const currentLocale = localeMap[locale as keyof typeof localeMap] || enUS;

    const { availablePets, availableSitters } = props;

    return (
        // Ensure you have date-fns v3 installed if using AdapterDateFnsV3
        // And @mui/x-date-pickers must be compatible.
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={currentLocale}>
            <Box component="form" onSubmit={actions.handleSubmit(actions.submit)} noValidate sx={{ mt: 1 }}>
                <Typography variant="h6" gutterBottom>
                    {computed.isEditMode ? formatMessage({ id: "labels.editBooking" }) : formatMessage({ id: "labels.createBooking" })}
                </Typography>
                <Grid container spacing={2}>
                    {(computed.isClientRole) && (
                        <>
                            {!computed.isEditMode && availableSitters && (
                                <Grid item xs={12}>
                                    <FormControl fullWidth error={!!state.errors.sitterId}>
                                        <InputLabel id="sitterId-label" required><FormattedMessage id="booking.selectSitter" /></InputLabel>
                                        <Controller
                                            name="sitterId"
                                            control={actions.control}
                                            defaultValue="" // Add default value for controlled component
                                            render={({ field }) => (
                                                <Select labelId="sitterId-label" label={<FormattedMessage id="booking.selectSitter" />} {...field}>
                                                    <MenuItem value="" disabled><em><FormattedMessage id="globals.placeholders.selectInput" values={{ fieldName: formatMessage({id: "globals.sitter"})}}/></em></MenuItem>
                                                    {availableSitters.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                                                </Select>
                                            )}
                                        />
                                        {state.errors.sitterId && <FormHelperText>{state.errors.sitterId.message}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                            )}
                            {!computed.isEditMode && availablePets && (
                                <Grid item xs={12}>
                                    <FormControl fullWidth error={!!state.errors.petId}>
                                        <InputLabel id="petId-label" required><FormattedMessage id="booking.selectPet" /></InputLabel>
                                        <Controller
                                            name="petId"
                                            control={actions.control}
                                            defaultValue="" // Add default value
                                            render={({ field }) => (
                                                <Select labelId="petId-label" label={<FormattedMessage id="booking.selectPet" />} {...field}>
                                                    <MenuItem value="" disabled><em><FormattedMessage id="globals.placeholders.selectInput" values={{ fieldName: formatMessage({id: "pet.name"})}}/></em></MenuItem>
                                                    {availablePets.map(p => <MenuItem key={p.id} value={p.id}>{p.name} ({p.type})</MenuItem>)}
                                                </Select>
                                            )}
                                        />
                                        {state.errors.petId && <FormHelperText>{state.errors.petId.message}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                            )}
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="startDate"
                                    control={actions.control}
                                    defaultValue="" // Add default value
                                    render={({ field, fieldState: { error } }) => (
                                        <DateTimePicker
                                            label={<FormattedMessage id="booking.startDate" />}
                                            value={field.value ? new Date(field.value) : null}
                                            onChange={(date) => field.onChange(date ? date.toISOString() : null)}
                                            slotProps={{ textField: { fullWidth: true, required: true, error: !!error, helperText: error?.message } }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="endDate"
                                    control={actions.control}
                                    defaultValue="" // Add default value
                                    render={({ field, fieldState: { error } }) => (
                                        <DateTimePicker
                                            label={<FormattedMessage id="booking.endDate" />}
                                            value={field.value ? new Date(field.value) : null}
                                            onChange={(date) => field.onChange(date ? date.toISOString() : null)}
                                            slotProps={{ textField: { fullWidth: true, required: true, error: !!error, helperText: error?.message } }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name="notes"
                                    control={actions.control}
                                    defaultValue="" // Add default value
                                    render={({ field, fieldState: { error } }) => (
                                        <TextField
                                            fullWidth
                                            label={formatMessage({ id: 'booking.notes' })}
                                            multiline
                                            rows={3}
                                            {...field}
                                            value={field.value || ""}
                                            error={!!error}
                                            helperText={error?.message}
                                        />
                                    )}
                                />
                            </Grid>
                        </>
                    )}
                    {!computed.isClientRole && computed.isEditMode && (
                        <Grid item xs={12}>
                            <FormControl fullWidth error={!!state.errors.status} required>
                                <InputLabel id="status-label"><FormattedMessage id="booking.status" /></InputLabel>
                                <Controller
                                    name="status"
                                    control={actions.control}
                                    defaultValue="" // Add default value
                                    render={({ field }) => (
                                        <Select labelId="status-label" label={<FormattedMessage id="booking.status" />} {...field}>
                                            <MenuItem value="" disabled><em><FormattedMessage id="globals.placeholders.selectInput" values={{ fieldName: formatMessage({id: "booking.status"})}}/></em></MenuItem>
                                            <MenuItem value={BookingStatusEnum.Accepted}><FormattedMessage id="booking.status.accepted" /></MenuItem>
                                            <MenuItem value={BookingStatusEnum.Rejected}><FormattedMessage id="booking.status.rejected" /></MenuItem>
                                            <MenuItem value={BookingStatusEnum.Completed}><FormattedMessage id="booking.status.completed" /></MenuItem>
                                        </Select>
                                    )}
                                />
                                {state.errors.status && <FormHelperText>{state.errors.status.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                    )}

                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
                    <Button onClick={props.onSubmitSuccess} disabled={computed.isSubmitting}>
                        <FormattedMessage id="buttons.cancel" />
                    </Button>
                    <Button type="submit" variant="contained" disabled={computed.isSubmitting}>
                        {computed.isSubmitting ? <CircularProgress size={24} /> : (computed.isEditMode ? <FormattedMessage id="buttons.update" /> : <FormattedMessage id="buttons.add" />)}
                    </Button>
                </Box>
            </Box>
        </LocalizationProvider>
    );
};