import {
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    FormLabel,
    Stack,
    OutlinedInput,
    MenuItem,
    Select,
    Paper,
    Typography,
    Grid
  } from "@mui/material";
  import { FormattedMessage, useIntl } from "react-intl";
  import { useRegisterFormController } from "./RegisterForm.controller";
  import { isEmpty, isUndefined } from "lodash";
  import { UserRoleEnum } from "@infrastructure/apis/client";
  import { Link } from "react-router-dom";
  import { AppRoute } from "../../../../routes";
  
  /**
   * Registration form component
   */
  export const RegisterForm = () => {
    const { formatMessage } = useIntl();
    const { state, actions, computed } = useRegisterFormController();
  
    return (
      <Paper elevation={3} className="max-w-md mx-auto p-6">
        <Typography variant="h5" component="h1" className="mb-4 text-center">
          <FormattedMessage id="auth.registerTitle" defaultMessage="Create your account" />
        </Typography>
        <Typography variant="body2" className="mb-6 text-center">
          <FormattedMessage id="auth.haveAccount" defaultMessage="Already have an account?" />{' '}
          <Link to={AppRoute.Login} className="text-blue-600 hover:text-blue-800">
            <FormattedMessage id="auth.signIn" defaultMessage="Sign in" />
          </Link>
        </Typography>
        
        <form onSubmit={actions.handleSubmit(actions.submit)}>
          <Stack spacing={3}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  error={!isUndefined(state.errors.name)}
                >
                  <FormLabel required>
                    <FormattedMessage id="forms.fields.name" defaultMessage="Full Name" />
                  </FormLabel>
                  <OutlinedInput
                    {...actions.register("name")}
                    placeholder={formatMessage(
                      { id: "forms.placeholder", defaultMessage: "Enter your {field}" },
                      { field: formatMessage({ id: "forms.fields.name", defaultMessage: "full name" }) }
                    )}
                  />
                  <FormHelperText error>
                    {state.errors.name?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  error={!isUndefined(state.errors.email)}
                >
                  <FormLabel required>
                    <FormattedMessage id="forms.fields.email" defaultMessage="Email" />
                  </FormLabel>
                  <OutlinedInput
                    type="email"
                    {...actions.register("email")}
                    placeholder={formatMessage(
                      { id: "forms.placeholder", defaultMessage: "Enter your {field}" },
                      { field: formatMessage({ id: "forms.fields.email", defaultMessage: "email" }) }
                    )}
                  />
                  <FormHelperText error>
                    {state.errors.email?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  error={!isUndefined(state.errors.phone)}
                >
                  <FormLabel required>
                    <FormattedMessage id="forms.fields.phone" defaultMessage="Phone Number" />
                  </FormLabel>
                  <OutlinedInput
                    {...actions.register("phone")}
                    placeholder={formatMessage(
                      { id: "forms.placeholder", defaultMessage: "Enter your {field}" },
                      { field: formatMessage({ id: "forms.fields.phone", defaultMessage: "phone number" }) }
                    )}
                  />
                  <FormHelperText error>
                    {state.errors.phone?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
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
                  />
                  <FormHelperText error>
                    {state.errors.password?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  error={!isUndefined(state.errors.confirmPassword)}
                >
                  <FormLabel required>
                    <FormattedMessage id="forms.fields.confirmPassword" defaultMessage="Confirm Password" />
                  </FormLabel>
                  <OutlinedInput
                    type="password"
                    {...actions.register("confirmPassword")}
                    placeholder={formatMessage(
                      { id: "forms.placeholder", defaultMessage: "Confirm your {field}" },
                      { field: formatMessage({ id: "forms.fields.password", defaultMessage: "password" }) }
                    )}
                  />
                  <FormHelperText error>
                    {state.errors.confirmPassword?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  error={!isUndefined(state.errors.role)}
                >
                  <FormLabel required>
                    <FormattedMessage id="forms.fields.role" defaultMessage="Account Type" />
                  </FormLabel>
                  <Select
                    {...actions.register("role")}
                    value={actions.watch("role")}
                    onChange={actions.selectRole}
                  >
                    <MenuItem value={UserRoleEnum.Client}>
                      <FormattedMessage id="roles.client" defaultMessage="Pet Owner (Client)" />
                    </MenuItem>
                    <MenuItem value={UserRoleEnum.Sitter}>
                      <FormattedMessage id="roles.sitter" defaultMessage="Pet Sitter" />
                    </MenuItem>
                  </Select>
                  <FormHelperText error>
                    {state.errors.role?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            
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
                <FormattedMessage id="auth.createAccount" defaultMessage="Create Account" />
              )}
            </Button>
          </Stack>
        </form>
      </Paper>
    );
  };