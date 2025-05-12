// This is for CLIENT and ADMIN roles
import React, { Fragment } from 'react';
import { WebsiteLayout } from "@presentation/layouts/WebsiteLayout";
import { Seo } from "@presentation/components/ui/Seo";
import { useIntl, FormattedMessage } from 'react-intl';
import { Container, Typography, Paper } from '@mui/material';
import { useGetUser } from '@infrastructure/apis/api-management';
import { useAppSelector } from '@application/store';
import { DataLoadingContainer } from '@presentation/components/ui/LoadingDisplay';
import { UserUpdateForm } from '@presentation/components/forms/User/UserUpdateForm';
import { UserRoleEnum } from '@infrastructure/apis/client'; // Import UserRoleEnum

// i18n keys:
// profile.client.title: "My Profile" (Used by Client)
// profile.admin.title: "My Profile" (Can be same or specific for Admin)
// profile.client.header: "Manage Your Account"
// profile.admin.header: "Manage Your Account"
// profile.client.subtitle: "Update your personal information and password."
// profile.admin.subtitle: "Update your personal information and password."

export const ProfilePage: React.FC = () => {
    const { formatMessage } = useIntl();
    const { userId, role } = useAppSelector(x => x.profileReducer);
    const { data: userData, isLoading, isError, refetch } = useGetUser(userId);

    const getSeoTitle = () => {
        if (role === UserRoleEnum.Admin) {
            return formatMessage({ id: 'profile.admin.title' });
        }
        // Default to client title for Client role or if role is somehow undefined here
        return formatMessage({ id: 'profile.client.title' });
    };

    const pageHeaderId = role === UserRoleEnum.Admin ? 'profile.admin.header' : 'profile.client.header';
    const pageSubtitleId = role === UserRoleEnum.Admin ? 'profile.admin.subtitle' : 'profile.client.subtitle';


    return (
        <Fragment>
            <Seo title={getSeoTitle()} /> {/* Use a function that returns the formatted string */}
            <WebsiteLayout>
                <Container maxWidth="md">
                    <Typography variant="h4" component="h1" gutterBottom>
                        <FormattedMessage id={pageHeaderId} />
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
                        <FormattedMessage id={pageSubtitleId} />
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
                                    onSubmitSuccess={() => refetch()}
                                />
                            </Paper>
                        )}
                    </DataLoadingContainer>
                </Container>
            </WebsiteLayout>
        </Fragment>
    );
};