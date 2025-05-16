import React from 'react';
import { Box, TextField, Button, CircularProgress, Grid, Typography, Rating, Select, MenuItem, FormControl, InputLabel, RadioGroup, FormControlLabel, Radio, Checkbox, FormHelperText } from '@mui/material';
import { Controller, Control, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { FeedbackFormModel, FeedbackType, ContactPreference } from './FeedbackForm.types';

interface FeedbackFormProps {
    onValidSubmit: (data: FeedbackFormModel) => void;
    handleSubmitFromController: UseFormHandleSubmit<FeedbackFormModel>;
    control: Control<FeedbackFormModel>;
    errors: FieldErrors<FeedbackFormModel>;
    isSubmitting: boolean;
    onCancel: () => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
                                                              onValidSubmit,
                                                              handleSubmitFromController,
                                                              control,
                                                              errors,
                                                              isSubmitting,
                                                              onCancel
                                                          }) => {
    const { formatMessage } = useIntl();

    return (
        <Box component="form" onSubmit={handleSubmitFromController(onValidSubmit)} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="legend" sx={{ mb: 1 }}>
                        <FormattedMessage id="feedback.ratingLabel" />*
                    </Typography>
                    <Controller
                        name="rating"
                        control={control}
                        defaultValue={0}
                        render={({ field }) => (
                            <Rating
                                {...field}
                                value={Number(field.value)}
                                onChange={(event, newValue) => {
                                    field.onChange(newValue);
                                }}
                                size="large"
                            />
                        )}
                    />
                    {errors.rating && <Typography color="error" variant="caption" sx={{ mt: 1 }}>{errors.rating.message}</Typography>}
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="comment"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                multiline
                                rows={4}
                                label={formatMessage({ id: "feedback.commentLabel" })}
                                placeholder={formatMessage({ id: "feedback.commentPlaceholder" })}
                                error={!!errors.comment}
                                helperText={errors.comment?.message}
                                required
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth error={!!errors.feedbackType} required>
                        <InputLabel id="feedback-type-label"><FormattedMessage id="feedback.feedbackTypeLabel" /></InputLabel>
                        <Controller
                            name="feedbackType"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Select
                                    labelId="feedback-type-label"
                                    label={<FormattedMessage id="feedback.feedbackTypeLabel" />}
                                    {...field}
                                >
                                    <MenuItem value="" disabled><em><FormattedMessage id="globals.placeholders.selectInput" values={{ fieldName: formatMessage({id: "feedback.feedbackTypeLabel"})}}/></em></MenuItem>
                                    {Object.values(FeedbackType).map((type) => (
                                        <MenuItem key={type} value={type}>
                                            <FormattedMessage id={`feedback.feedbackType.${type.toLowerCase()}`} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.feedbackType && <FormHelperText>{errors.feedbackType.message}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl component="fieldset" error={!!errors.contactPreference} required sx={{width: '100%'}}>
                        <Typography component="legend" variant="subtitle1" sx={{mb:1}}><FormattedMessage id="feedback.contactPreferenceLabel" /></Typography>
                        <Controller
                            name="contactPreference"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <RadioGroup {...field} row>
                                    {Object.values(ContactPreference).map((pref) => (
                                        <FormControlLabel key={pref} value={pref} control={<Radio />} label={<FormattedMessage id={`feedback.contactPreference.${pref.toLowerCase()}`} />} />
                                    ))}
                                </RadioGroup>
                            )}
                        />
                        {errors.contactPreference && <FormHelperText>{errors.contactPreference.message}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Controller
                                name="allowFollowUp"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => <Checkbox {...field} checked={field.value} />}
                            />}
                        label={<FormattedMessage id="feedback.allowFollowUpLabel" />}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                type="email"
                                label={formatMessage({ id: "globals.email" }) + ` (${formatMessage({id: "globals.optional"})})`}
                                placeholder="your.email@example.com"
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        )}
                    />
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
                <Button onClick={onCancel} disabled={isSubmitting}>
                    <FormattedMessage id="buttons.cancel" />
                </Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {isSubmitting ? <CircularProgress size={24} /> : <FormattedMessage id="feedback.submitButton" />}
                </Button>
            </Box>
        </Box>
    );
};