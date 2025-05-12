import { WebsiteLayout } from "@presentation/layouts/WebsiteLayout";
import { Fragment, memo } from "react";
import { Box, Container, Typography, Link as MuiLink, Paper } from "@mui/material";
import { Seo } from "@presentation/components/ui/Seo";
import { RegisterForm } from "@presentation/components/forms/Register/RegisterForm";
import { useIntl, FormattedMessage } from "react-intl";
import { Link as RouterLink } from 'react-router-dom';
import { AppRoute } from "routes";

export const RegisterPage = memo(() => {
    const { formatMessage } = useIntl();

    return (
        <Fragment>
            <Seo title={formatMessage({ id: "register.seoTitle" })} />
            <WebsiteLayout>
                <Container component="main" maxWidth="sm">
                    <Box
                        sx={{
                            marginTop: { xs: 2, sm: 4, md: 8 }, // Responsive margin top
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Paper elevation={3} sx={{ padding: { xs: 2, sm: 3, md: 4 }, width: '100%', borderRadius: 2 }}>
                            <Typography component="h1" variant="h4" align="center" gutterBottom>
                                <FormattedMessage id="register.pageHeader" />
                            </Typography>
                            <RegisterForm />
                            <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
                                <FormattedMessage id="register.alreadyHaveAccount" />{' '}
                                <MuiLink component={RouterLink} to={AppRoute.Login} variant="body2">
                                    <FormattedMessage id="globals.login" />
                                </MuiLink>
                            </Typography>
                        </Paper>
                    </Box>
                </Container>
            </WebsiteLayout>
        </Fragment>
    );
});