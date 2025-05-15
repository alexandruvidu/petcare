import React from 'react';
import { Box, TextField, Button, CircularProgress, Grid, Typography, Rating } from '@mui/material';
import { Controller, Control, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { FeedbackFormModel } from './FeedbackForm.types';

interface FeedbackFormProps {
    // This is the raw submit function that react-hook-form's handleSubmit will call
    onValidSubmit: (data: FeedbackFormModel) => void;
    handleSubmitFromController: UseFormHandleSubmit<FeedbackFormModel>; // The handleSubmit from useForm
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
        // Use react-hook-form's handleSubmit to wrap your onValidSubmit function
        <Box component="form" onSubmit={handleSubmitFromController(onValidSubmit)} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="legend" sx={{ mb: 1 }}>
                        <FormattedMessage id="feedback.ratingLabel" />
                    </Typography>
                    <Controller
                        name="rating"
                        control={control}
                        defaultValue={0}
                        render={({ field }) => (
                            <Rating
                                {...field}
                                value={Number(field.value)} // Ensure value is number for Rating
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
                    <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                type="email"
                                label={formatMessage({ id: "globals.email" }) + " (Optional)"}
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