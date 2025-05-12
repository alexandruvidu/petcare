import {
    Button,
    CircularProgress,
    Stack,
    TextField, // Changed to TextField
    Box,
    Typography
} from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { useLoginFormController } from "./LoginForm.controller";
import { isEmpty } from "lodash";
import { Paper } from '@mui/material'; // For card-like appearance

export const LoginForm = () => {
    const { formatMessage } = useIntl();
    const { state, actions, computed } = useLoginFormController();

    return (
        <Paper elevation={3} sx={{ padding: { xs: 2, sm: 3, md: 4 }, margin: 'auto', maxWidth: 400, mt: 8 }}> {/* Card-like container */}
            <Typography component="h1" variant="h5" align="center" sx={{ mb: 3 }}>
                <FormattedMessage id="globals.login" />
            </Typography>
            <Box component="form" onSubmit={actions.handleSubmit(actions.submit)} noValidate>
                <Stack spacing={2}>
                    <TextField
                        required
                        fullWidth
                        id="email"
                        label={formatMessage({ id: "globals.email" })}
                        autoComplete="email"
                        autoFocus
                        {...actions.register("email")}
                        error={!!state.errors.email}
                        helperText={state.errors.email?.message}
                    />
                    <TextField
                        required
                        fullWidth
                        id="password"
                        label={formatMessage({ id: "globals.password" })}
                        type="password"
                        autoComplete="current-password"
                        {...actions.register("password")}
                        error={!!state.errors.password}
                        helperText={state.errors.password?.message}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={!isEmpty(state.errors) || computed.isSubmitting}
                        sx={{ mt: 2, py: 1.5 }} // Larger submit button
                    >
                        {computed.isSubmitting ? <CircularProgress size={24} color="inherit" /> : <FormattedMessage id="globals.submit" />}
                    </Button>
                </Stack>
            </Box>
        </Paper>
    );
};