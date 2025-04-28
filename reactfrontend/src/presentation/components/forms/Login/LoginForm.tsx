import {
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    FormLabel,
    Stack,
    OutlinedInput,
    Paper,
    Typography,
    Box
  } from "@mui/material";
  import { FormattedMessage, useIntl } from "react-intl";
  import { useLoginFormController } from "./LoginForm.controller";
  import { isEmpty, isUndefined } from "lodash";
  import { Link } from "react-router-dom";
  import { AppRoute } from "../../../../routes";
  
  /**
   * Login form component
   */
  export const LoginForm = () => {
    const { formatMessage } = useIntl();
    const { state, actions, computed } = useLoginFormController();
  
    return (
      <Paper elevation={3} className="max-w-md mx-auto p-6">
        <Typography variant="h5" component="h1" className="mb-4 text-center">
          <FormattedMessage id="auth.loginTitle" defaultMessage="Sign in to your account" />
        </Typography>
        <Typography variant="body2" className="mb-6 text-center">
          <FormattedMessage id="auth.noAccount" defaultMessage="Don't have an account?" />{' '}
          <Link to={AppRoute.Register} className="text-blue-600 hover:text-blue-800">
            <FormattedMessage id="auth.createAccount" defaultMessage="Create one" />
          </Link>
        </Typography>
        
        <form onSubmit={actions.handleSubmit(actions.submit)}>
          <Stack spacing={3}>
            <FormControl
              fullWidth
              error={!isUndefined(state.errors.email)}
            >
              <FormLabel required>
                <FormattedMessage id="forms.fields.email" defaultMessage="Email" />
              </FormLabel>
              <OutlinedInput
                {...actions.register("email")}
                placeholder={formatMessage(
                  { id: "forms.placeholder", defaultMessage: "Enter your {field}" },
                  { field: formatMessage({ id: "forms.fields.email", defaultMessage: "email" }) }
                )}
                autoComplete="email"
              />
              <FormHelperText error>
                {state.errors.email?.message}
              </FormHelperText>
            </FormControl>
            
            <FormControl
              fullWidth
              error={!isUndefined(state.errors.password)}
            >
              <FormLabel required>
                <FormattedMessage id="forms.fields.password" defaultMessage="Password" />
              </FormLabel>
              <OutlinedInput
                type="password"
                {...actions.register("password")}
                placeholder={formatMessage(
                  { id: "forms.placeholder", defaultMessage: "Enter your {field}" },
                  { field: formatMessage({ id: "forms.fields.password", defaultMessage: "password" }) }
                )}
                autoComplete="current-password"
              />
              <FormHelperText error>
                {state.errors.password?.message}
              </FormHelperText>
            </FormControl>
            
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth
              disabled={!isEmpty(state.errors) || computed.isSubmitting}
              className="mt-4"
            >
              {computed.isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <FormattedMessage id="auth.signIn" defaultMessage="Sign in" />
              )}
            </Button>
          </Stack>
        </form>
      </Paper>
    );
  };