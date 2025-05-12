import { WebsiteLayout } from "@presentation/layouts/WebsiteLayout";
import { Fragment, memo } from "react";
import { Box, Container, Typography, Link as MuiLink, Paper } from "@mui/material"; // Added MuiLink
import { Seo } from "@presentation/components/ui/Seo";
import { RegisterForm } from "@presentation/components/forms/Register/RegisterForm";
import { useIntl, FormattedMessage } from "react-intl";
import { Link as RouterLink } from 'react-router-dom';
import { AppRoute } from "routes";

// i18n keys to add/ensure exist:
// register.seoTitle: "PetCare | Create Account"
// register.pageHeader: "Create Your PetCare Account"
// register.alreadyHaveAccount: "Already have an account?"
// globals.login: "Login" (should exist)

export const RegisterPage = memo(() => {
    const { formatMessage } = useIntl();

    return (
        <Fragment>
            <Seo title={formatMessage({ id: "register.seoTitle" })} />
            <WebsiteLayout>
                <Container component="main" maxWidth="sm"> {/* Adjusted maxWidth for better form layout */}
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h1" variant="h4" gutterBottom> {/* Adjusted variant */}
                            <FormattedMessage id="register.pageHeader" />
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1, mb: 3 }}> {/* Adjusted margins */}
                            <FormattedMessage id="register.alreadyHaveAccount" />{' '}
                            <MuiLink component={RouterLink} to={AppRoute.Login} variant="body1">
                                <FormattedMessage id="globals.login" />
                            </MuiLink>
                        </Typography>
                        <Paper elevation={3} sx={{ p: {xs: 2, sm: 3, md: 4}, width: '100%', borderRadius: 2}}> {/* Added Paper for card-like feel */}
                            <RegisterForm />
                        </Paper>
                    </Box>
                </Container>
            </WebsiteLayout>
        </Fragment>
    );
});