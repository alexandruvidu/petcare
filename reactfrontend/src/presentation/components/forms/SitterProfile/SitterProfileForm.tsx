import React from 'react';
import { TextField, Button, Box, Grid, CircularProgress, Typography } from '@mui/material';
import { useIntl, FormattedMessage } from 'react-intl';
import { SitterProfileFormProps } from "./SitterProfileForm.types";
import { useSitterProfileFormController } from "./SitterProfileForm.controller";

export const SitterProfileForm: React.FC<SitterProfileFormProps> = (props) => {
    const { formatMessage } = useIntl();
    const { state, actions, computed } = useSitterProfileFormController(props);

    return (
        <Box component="form" onSubmit={actions.handleSubmit(actions.submit)} noValidate sx={{ mt: 1 }}>
            <Typography variant="h6" gutterBottom>
                <FormattedMessage id="labels.sitterProfile" />
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{mb:2}}>
                <FormattedMessage id="sitter.profile.formSubtitle" /> {/* i18n: This information will be displayed to pet owners... */}
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        required
                        label={formatMessage({ id: "labels.bio" })}
                        multiline
                        rows={4}
                        {...actions.register("bio")}
                        error={!!state.errors.bio}
                        helperText={state.errors.bio?.message}
                        placeholder={formatMessage({id: "sitter.bioPlaceholder"})}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        required
                        label={formatMessage({ id: "labels.yearsExperience" })}
                        type="number"
                        {...actions.register("yearsExperience")}
                        error={!!state.errors.yearsExperience}
                        helperText={state.errors.yearsExperience?.message}
                        inputProps={{ min: 0, max: 100 }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        required
                        label={formatMessage({ id: "labels.hourlyRate" })}
                        type="number"
                        {...actions.register("hourlyRate")}
                        error={!!state.errors.hourlyRate}
                        helperText={state.errors.hourlyRate?.message}
                        inputProps={{ min: 0, step: "0.01" }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        required
                        label={formatMessage({ id: "labels.location" })}
                        {...actions.register("location")}
                        error={!!state.errors.location}
                        helperText={state.errors.location?.message}
                        placeholder={formatMessage({id: "sitter.locationPlaceholder"})}
                    />
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button type="submit" variant="contained" disabled={computed.isSubmitting}>
                    {computed.isSubmitting
                        ? <CircularProgress size={24} />
                        : (computed.isEditMode ? <FormattedMessage id="labels.updateProfile" /> : <FormattedMessage id="labels.createProfile" />)}
                </Button>
            </Box>
        </Box>
    );
};