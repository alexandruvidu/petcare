import {
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    InputLabel,
    Grid,
    Box,
    TextField, // Using TextField for consistency and better label integration
    Select,
    MenuItem,
    Typography
} from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { useRegisterFormController } from "./RegisterForm.controller";
import { isEmpty } from "lodash"; // isUndefined might not be needed if errors are checked directly
import { UserRoleEnum } from "@infrastructure/apis/client";
import { Controller } from "react-hook-form";

export const RegisterForm = () => {
    const { formatMessage } = useIntl();
    const { state, actions, computed } = useRegisterFormController();

    return (
        <Box component="form" onSubmit={actions.handleSubmit(actions.submit)} sx={{ mt: 1, width: '100%' }}> {/* Removed noValidate to let yup handle it */}
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
                <Grid item xs={12}>
                    <FormControl fullWidth error={!!state.errors.role} required>
                        <InputLabel id="role-select-label">
                            <FormattedMessage id="labels.accountType" />
                        </InputLabel>
                        <Controller
                            name="role"
                            control={actions.control}
                            defaultValue="" // Default to empty string for placeholder
                            render={({ field }) => (
                                <Select
                                    labelId="role-select-label"
                                    id="role"
                                    label={<FormattedMessage id="labels.accountType" />}
                                    {...field}
                                >
                                    <MenuItem value="" disabled>
                                        <Typography color="textSecondary">
                                            <FormattedMessage id="globals.placeholders.selectInput" values={{ fieldName: formatMessage({ id: "labels.accountType" })}} />
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem value={UserRoleEnum.Client}>
                                        <FormattedMessage id="labels.petOwner" />
                                    </MenuItem>
                                    <MenuItem value={UserRoleEnum.Sitter}>
                                        <FormattedMessage id="labels.petSitter" />
                                    </MenuItem>
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
                disabled={computed.isSubmitting} // Removed !isEmpty(state.errors) as yup will prevent submission
            >
                {computed.isSubmitting ? <CircularProgress size={24} /> : <FormattedMessage id="register.submitButton" />}
            </Button>
        </Box>
    );
};