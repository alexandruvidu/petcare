import React, { Fragment, useState } from 'react';
import { WebsiteLayout } from "@presentation/layouts/WebsiteLayout";
import { Seo } from "@presentation/components/ui/Seo";
import { useIntl, FormattedMessage } from 'react-intl';
import { Container, Typography, Paper, Box, Tabs, Tab, Alert } from '@mui/material';
import { useGetUser, useGetMySitterProfile } from '@infrastructure/apis/api-management';
import { useAppSelector } from '@application/store';
import { DataLoadingContainer } from '@presentation/components/ui/LoadingDisplay';
import { UserUpdateForm } from '@presentation/components/forms/User/UserUpdateForm';
import { SitterProfileForm } from '@presentation/components/forms/SitterProfile/SitterProfileForm';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WorkIcon from '@mui/icons-material/Work';
import { useLocation } from 'react-router-dom'; // To read tab state

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`sitter-profile-tabpanel-${index}`}
            aria-labelledby={`sitter-profile-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `sitter-profile-tab-${index}`,
        'aria-controls': `sitter-profile-tabpanel-${index}`,
    };
}

// i18n keys for SitterProfilePage.tsx:
// profile.sitter.title: "My Sitter Profile & Account" (SEO title)
// profile.sitter.header: "Manage Your Profile & Account"
// profile.sitter.tab.account: "Account Details"
// profile.sitter.tab.professional: "Sitter Profile"
// profile.sitter.professional.noProfile: "You haven't created your sitter profile yet. Fill out this section to make your profile visible to pet owners!"


export const SitterProfilePage: React.FC = () => {
    const { formatMessage } = useIntl();
    const location = useLocation(); // For reading state for default tab
    const { userId } = useAppSelector(x => x.profileReducer);

    const [currentTab, setCurrentTab] = useState(() => {
        // Check if a default tab was passed via route state (e.g., from SitterDashboard)
        return location.state?.defaultTab === 'professional' ? 1 : 0;
    });

    const { data: userData, isLoading: isLoadingUser, isError: isErrorUser, refetch: refetchUser } = useGetUser(userId);
    const { data: sitterProfileData, isLoading: isLoadingSitterProfile, isError: isErrorSitterProfile, refetch: refetchSitterProfile } = useGetMySitterProfile();

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    const hasExistingSitterProfile = !!sitterProfileData?.response;
    const isLoading = isLoadingUser || isLoadingSitterProfile;
    const isError = isErrorUser || isErrorSitterProfile;
    const refetchAll = () => {
        refetchUser();
        refetchSitterProfile();
    }

    return (
        <Fragment>
            <Seo title={formatMessage({ id: 'profile.sitter.title' })} />
            <WebsiteLayout>
                <Container maxWidth="md">
                    <Typography variant="h4" component="h1" gutterBottom sx={{mb:3}}>
                        <FormattedMessage id="profile.sitter.header" />
                    </Typography>

                    <Paper elevation={2} sx={{ overflow: 'hidden' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={currentTab} onChange={handleChangeTab} aria-label="sitter profile tabs" variant="fullWidth">
                                <Tab label={formatMessage({id: "profile.sitter.tab.account"})} icon={<AccountCircleIcon />} iconPosition="start" {...a11yProps(0)} />
                                <Tab label={formatMessage({id: "profile.sitter.tab.professional"})} icon={<WorkIcon />} iconPosition="start" {...a11yProps(1)} />
                            </Tabs>
                        </Box>
                        <DataLoadingContainer isLoading={isLoading} isError={isError} tryReload={refetchAll}>
                            <TabPanel value={currentTab} index={0}>
                                <Box p={{xs:2, md:3}}>
                                    {userData?.response && (
                                        <UserUpdateForm
                                            initialData={{
                                                name: userData.response.name || "",
                                                email: userData.response.email || "",
                                                phone: userData.response.phone || "",
                                            }}
                                            onSubmitSuccess={() => refetchUser()}
                                        />
                                    )}
                                </Box>
                            </TabPanel>
                            <TabPanel value={currentTab} index={1}>
                                <Box p={{xs:2, md:3}}>
                                    {!isLoadingSitterProfile && !hasExistingSitterProfile && currentTab === 1 && (
                                        <Alert severity="info" sx={{ mb: 2 }}>
                                            <FormattedMessage id="profile.sitter.professional.noProfile" />
                                        </Alert>
                                    )}
                                    <SitterProfileForm
                                        initialData={sitterProfileData?.response || undefined}
                                        hasExistingProfile={hasExistingSitterProfile}
                                        onSubmitSuccess={() => refetchSitterProfile()}
                                    />
                                </Box>
                            </TabPanel>
                        </DataLoadingContainer>
                    </Paper>
                </Container>
            </WebsiteLayout>
        </Fragment>
    );
};