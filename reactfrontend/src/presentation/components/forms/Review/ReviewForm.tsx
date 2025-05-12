import React from 'react';
import { TextField, Button, Box, Grid, CircularProgress, Typography, Rating } from '@mui/material';
import { useIntl, FormattedMessage } from 'react-intl';
import { ReviewFormProps } from "./ReviewForm.types";
import { useReviewFormController } from "./ReviewForm.controller";
import { Controller } from 'react-hook-form';

export const ReviewForm: React.FC<ReviewFormProps> = (props) => {
    const { formatMessage } = useIntl();
    const { state, actions, computed } = useReviewFormController(props);

    return (
        <Box component="form" onSubmit={actions.handleSubmit(actions.submit)} noValidate sx={{ mt: 1 }}>
            <Typography variant="h6" gutterBottom>
                {computed.isEditMode ? <FormattedMessage id="labels.updateReview" /> : <FormattedMessage id="labels.leaveReview" />}
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Typography component="legend"><FormattedMessage id="labels.rating" /></Typography>
                    <Controller
                        name="rating"
                        control={actions.control}
                        render={({ field: { onChange, value } }) => (
                            <Rating
                                name="rating"
                                value={Number(value)}
                                onChange={(event, newValue) => {
                                    onChange(newValue);
                                }}
                                size="large"
                            />
                        )}
                    />
                    {state.errors.rating && <Typography color="error" variant="caption">{state.errors.rating.message}</Typography>}
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="comment"
                        control={actions.control}
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                fullWidth
                                required
                                label={formatMessage({ id: "labels.comment" })}
                                multiline
                                rows={4}
                                {...field}
                                error={!!error}
                                helperText={error?.message}
                                placeholder={formatMessage({id: "review.commentPlaceholder"})}
                            />
                        )}
                    />
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
                <Button onClick={props.onSubmitSuccess} disabled={computed.isSubmitting}> {/* Assuming onSubmitSuccess closes modal */}
                    <FormattedMessage id="buttons.cancel" />
                </Button>
                <Button type="submit" variant="contained" disabled={computed.isSubmitting}>
                    {computed.isSubmitting ? <CircularProgress size={24} /> : <FormattedMessage id="labels.submitReview" />}
                </Button>
            </Box>
        </Box>
    );
};