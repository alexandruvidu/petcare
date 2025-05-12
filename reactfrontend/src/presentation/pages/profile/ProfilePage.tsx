// This is for CLIENT role
import React, { Fragment } from 'react';
import { WebsiteLayout } from "@presentation/layouts/WebsiteLayout";
import { Seo } from "@presentation/components/ui/Seo";
import { useIntl, FormattedMessage } from 'react-intl';
import { Container, Typography, Paper, Box } from '@mui/material';
import { useGetUser } from '@infrastructure/apis/api-management'; // Assuming useGetUser is GetMe or takes loggedIn user ID
import { useAppSelector } from '@application/store';
import { DataLoadingContainer } from '@presentation/components/ui/LoadingDisplay';
import { UserUpdateForm } from '@presentation/components/forms/User/UserUpdateForm';

// i18n: profile.client.title: "My Profile"
// profile.client.header: "Manage Your Account"
// profile.client.subtitle: "Update your personal information and password."

export const ProfilePage: React.FC = () => {
    const { formatMessage } = useIntl();
    const { userId } = useAppSelector(x => x.profileReducer); // Get own user ID
    const { data: userData, isLoading, isError, refetch } = useGetUser(userId); // Fetch own user data

    return (
        <Fragment>
            <Seo title={formatMessage({ id: 'profile.client.title' })} />
            <WebsiteLayout>
                <Container maxWidth="md">
                    <Typography variant="h4" component="h1" gutterBottom>
                        <FormattedMessage id="profile.client.header" />
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
                        <FormattedMessage id="profile.client.subtitle" />
                    </Typography>
                    <DataLoadingContainer isLoading={isLoading} isError={isError} tryReload={refetch}>
                        {userData?.response && (
                            <Paper elevation={3} sx={{ p: {xs: 2, md: 4} }}>
                                <UserUpdateForm
                                    initialData={{
                                        name: userData.response.name || "",
                                        email: userData.response.email || "",
                                        phone: userData.response.phone || "",
                                    }}
                                    onSubmitSuccess={() => refetch()} // Refetch user data on success
                                />
                            </Paper>
                        )}
                    </DataLoadingContainer>
                </Container>
            </WebsiteLayout>
        </Fragment>
    );
};