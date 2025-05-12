import React from 'react'; // Make sure React is imported if not already
import {
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    InputLabel,
    Grid,
    Box,
    TextField,
    Select,
    MenuItem,
    Typography // Added Typography if needed for any internal text
} from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { useUserAddFormController } from "./UserAddForm.controller";
// import { isEmpty } from "lodash"; // isEmpty was removed from disabled prop logic
import { UserRoleEnum } from "@infrastructure/apis/client";
import { Controller } from "react-hook-form";

// Props for UserAddForm - assuming onSubmit is optional
interface UserAddFormProps {
    onSubmit?: () => void;
}

export const UserAddForm: React.FC<UserAddFormProps> = (props) => { // Ensure React.FC type and export
    const { formatMessage } = useIntl();
    const { state, actions, computed } = useUserAddFormController(props.onSubmit);

    return (
        <Box component="form" onSubmit={actions.handleSubmit(actions.submit)} sx={{ mt: 1, width: '100%'}}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="name"
                        control={actions.control}
                        defaultValue=""
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                required
                                fullWidth
                                id="name-admin-add"
                                label={formatMessage({ id: "globals.name" })}
                                autoComplete="name"
                                error={!!error}
                                helperText={error?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="email"
                        control={actions.control}
                        defaultValue=""
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                required
                                fullWidth
                                id="email-admin-add"
                                label={formatMessage({ id: "globals.email" })}
                                type="email"
                                autoComplete="email"
                                error={!!error}
                                helperText={error?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="phone"
                        control={actions.control}
                        defaultValue=""
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                required
                                fullWidth
                                id="phone-admin-add"
                                label={formatMessage({ id: "globals.phone" })}
                                autoComplete="tel"
                                error={!!error}
                                helperText={error?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="password"
                        control={actions.control}
                        defaultValue=""
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                required
                                fullWidth
                                id="password-admin-add"
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
                    <FormControl fullWidth error={!!state.errors.role} required>
                        <InputLabel id="role-select-label-admin-add">
                            <FormattedMessage id="globals.role" />
                        </InputLabel>
                        <Controller
                            name="role"
                            control={actions.control}
                            defaultValue={UserRoleEnum.Client} // Default for admin add
                            render={({ field }) => (
                                <Select
                                    labelId="role-select-label-admin-add"
                                    id="role-admin-add"
                                    label={<FormattedMessage id="globals.role" />}
                                    {...field}
                                >
                                    {/* Admin can create any role */}
                                    <MenuItem value={UserRoleEnum.Client}><FormattedMessage id="globals.client" /></MenuItem>
                                    <MenuItem value={UserRoleEnum.Sitter}><FormattedMessage id="globals.sitter" /></MenuItem>
                                    <MenuItem value={UserRoleEnum.Admin}><FormattedMessage id="globals.admin" /></MenuItem>
                                </Select>
                            )}
                        />
                        {state.errors.role && <FormHelperText>{state.errors.role?.message}</FormHelperText>}
                    </FormControl>
                </Grid>
            </Grid>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={computed.isSubmitting} // Simplified disabled logic
            >
                {computed.isSubmitting ? <CircularProgress size={24} /> : <FormattedMessage id="labels.addUser" />}
            </Button>
        </Box>
    )
};