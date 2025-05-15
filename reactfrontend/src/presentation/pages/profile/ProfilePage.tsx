import React, { Fragment, useEffect } from 'react';
import { WebsiteLayout } from "@presentation/layouts/WebsiteLayout";
import { Seo } from "@presentation/components/ui/Seo";
import { useIntl, FormattedMessage } from 'react-intl';
import { Container, Typography, Paper, Grid, Button } from '@mui/material';
import { useGetUser } from '@infrastructure/apis/api-management';
import { useAppSelector } from '@application/store';
import { DataLoadingContainer } from '@presentation/components/ui/LoadingDisplay';
import { UserUpdateForm } from '@presentation/components/forms/User/UserUpdateForm';
import { UserRoleEnum } from '@infrastructure/apis/client';

export const ProfilePage: React.FC = () => {
    const { formatMessage } = useIntl();
    const { userId, role } = useAppSelector(x => x.profileReducer);
    const { data: userData, isLoading, isError, refetch } = useGetUser(userId);

    // Create a unique React key based on user ID for re-mounting component when user changes
    const userKey = `profile-${userId}-${role}`;

    // Force refetch when component mounts to ensure updated data
    useEffect(() => {
        refetch();
    }, [userId, refetch]);

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
            <Seo title={getSeoTitle()} />
            <WebsiteLayout>
                <Container maxWidth="md">
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h4" component="h1" gutterBottom>
                                <FormattedMessage id={pageHeaderId} />
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
                                <FormattedMessage id={pageSubtitleId} />
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <DataLoadingContainer isLoading={isLoading} isError={isError} tryReload={refetch}>
                                {userData?.response && (
                                    <Paper elevation={3} sx={{ p: {xs: 2, md: 4} }}>
                                        <UserUpdateForm
                                            key={userKey}
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
                        </Grid>
                    </Grid>
                </Container>
            </WebsiteLayout>
        </Fragment>
    );
};