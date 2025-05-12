import React from 'react';
import { TextField, Button, Box, Grid, CircularProgress, Typography, Divider } from '@mui/material';
import { useIntl, FormattedMessage } from 'react-intl';
import { UserUpdateFormProps } from "./UserUpdateForm.types";
import { useUserUpdateFormController } from "./UserUpdateForm.controller";

export const UserUpdateForm: React.FC<UserUpdateFormProps> = (props) => {
    const { formatMessage } = useIntl();
    const { state, actions, computed } = useUserUpdateFormController(props);

    return (
        <Box component="form" onSubmit={actions.handleSubmit(actions.submit)} noValidate sx={{ mt: 1 }}>
            <Typography variant="h6" gutterBottom>
                <FormattedMessage id="labels.personalInformation" />
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth required label={formatMessage({ id: "globals.name" })} {...actions.register("name")} error={!!state.errors.name} helperText={state.errors.name?.message} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth required label={formatMessage({ id: "globals.email" })} type="email" {...actions.register("email")} error={!!state.errors.email} helperText={state.errors.email?.message} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth required label={formatMessage({ id: "globals.phone" })} {...actions.register("phone")} error={!!state.errors.phone} helperText={state.errors.phone?.message} />
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }}><FormattedMessage id="labels.changePassword" /></Divider>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label={formatMessage({ id: "globals.password" })} type="password" {...actions.register("password")} error={!!state.errors.password} helperText={state.errors.password?.message} autoComplete="new-password" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label={formatMessage({ id: "globals.confirmPassword" })} type="password" {...actions.register("confirmPassword")} error={!!state.errors.confirmPassword} helperText={state.errors.confirmPassword?.message} autoComplete="new-password"/>
                </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button type="submit" variant="contained" disabled={computed.isSubmitting}>
                    {computed.isSubmitting ? <CircularProgress size={24} /> : <FormattedMessage id="labels.saveChanges" />}
                </Button>
            </Box>
        </Box>
    );
};