import React from 'react'; // Ensure React is imported
import {
    Button,
    CircularProgress,
    Grid,
    Box,
    TextField,
    Typography,
    Paper,
    FormHelperText
} from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { useRegisterFormController } from "./RegisterForm.controller";
import { UserRoleEnum } from "@infrastructure/apis/client";
import { Controller } from "react-hook-form";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';

export const RegisterForm = () => {
    const { formatMessage } = useIntl();
    const { state, actions, computed } = useRegisterFormController();

    const selectedRole = actions.control._formValues.role;

    return (
        <Box component="form" onSubmit={actions.handleSubmit(actions.submit)} sx={{ mt: 1, width: '100%' }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Controller
                        name="name"
                        control={actions.control}
                        defaultValue=""
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                required
                                fullWidth
                                id="name"
                                label={formatMessage({ id: "globals.name" })}
                                autoComplete="name"
                                error={!!error}
                                helperText={error?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="email"
                        control={actions.control}
                        defaultValue=""
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                required
                                fullWidth
                                id="email"
                                label={formatMessage({ id: "globals.email" })}
                                type="email"
                                autoComplete="email"
                                error={!!error}
                                helperText={error?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="phone"
                        control={actions.control}
                        defaultValue=""
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                required
                                fullWidth
                                id="phone"
                                label={formatMessage({ id: "globals.phone" })}
                                autoComplete="tel"
                                error={!!error}
                                helperText={error?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="password"
                        control={actions.control}
                        defaultValue=""
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                required
                                fullWidth
                                id="password"
                                label={formatMessage({ id: "globals.password" })}
                                type="password"
                                autoComplete="new-password"
                                error={!!error}
                                helperText={error?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="confirmPassword"
                        control={actions.control}
                        defaultValue=""
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                required
                                fullWidth
                                id="confirmPassword"
                                label={formatMessage({ id: "globals.confirmPassword" })}
                                type="password"
                                autoComplete="new-password"
                                error={!!error}
                                helperText={error?.message}
                            />
                        )}
                    />
                </Grid>

                {/* Role Selection Buttons */}
                <Grid item xs={12} sx={{ mt: 1 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{textAlign: 'center', mb: 1.5}}>
                        <FormattedMessage id="labels.accountType" />*
                    </Typography>
                    <Controller
                        name="role"
                        control={actions.control}
                        defaultValue=""
                        render={() => <React.Fragment /> } //  Return an empty Fragment
                    />
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} sm={6}>
                            <Button
                                fullWidth
                                variant={selectedRole === UserRoleEnum.Client ? "contained" : "outlined"}
                                onClick={() => actions.setValue('role', UserRoleEnum.Client, { shouldValidate: true })}
                                sx={{ py: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
                                color={selectedRole === UserRoleEnum.Client ? "primary" : "inherit"}
                            >
                                <PersonOutlineIcon sx={{ fontSize: 40 }} />
                                <Typography variant="button"><FormattedMessage id="labels.petOwner" /></Typography>
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button
                                fullWidth
                                variant={selectedRole === UserRoleEnum.Sitter ? "contained" : "outlined"}
                                onClick={() => actions.setValue('role', UserRoleEnum.Sitter, { shouldValidate: true })}
                                sx={{ py: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
                                color={selectedRole === UserRoleEnum.Sitter ? "primary" : "inherit"}
                            >
                                <SupervisedUserCircleIcon sx={{ fontSize: 40 }} />
                                <Typography variant="button"><FormattedMessage id="labels.petSitter" /></Typography>
                            </Button>
                        </Grid>
                    </Grid>
                    {state.errors.role && (
                        <FormHelperText error sx={{ textAlign: 'center', mt: 1 }}>
                            {state.errors.role.message}
                        </FormHelperText>
                    )}
                </Grid>
            </Grid>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={computed.isSubmitting}
            >
                {computed.isSubmitting ? <CircularProgress size={24} /> : <FormattedMessage id="register.submitButton" />}
            </Button>
        </Box>
    );
};