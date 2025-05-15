import React, { Fragment, useState, useEffect } from 'react';
import { WebsiteLayout } from "@presentation/layouts/WebsiteLayout";
import { Seo } from "@presentation/components/ui/Seo";
import { useIntl, FormattedMessage } from 'react-intl';
import {
    Container,
    Typography,
    Paper,
    Box,
    Grid,
    Tabs,
    Tab,
    Alert,
    Divider,
    Card,
    CardContent,
    Rating,
    Avatar,
    CircularProgress,
    Button
} from '@mui/material';
import { useGetUser, useGetMySitterProfile, useGetReviewsForSitter } from '@infrastructure/apis/api-management';
import { useAppSelector } from '@application/store';
import { DataLoadingContainer } from '@presentation/components/ui/LoadingDisplay';
import { UserUpdateForm } from '@presentation/components/forms/User/UserUpdateForm';
import { SitterProfileForm } from '@presentation/components/forms/SitterProfile/SitterProfileForm';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WorkIcon from '@mui/icons-material/Work';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SchoolIcon from '@mui/icons-material/School';
import { useLocation } from 'react-router-dom';
import { dateToDateString } from '@infrastructure/utils/dateUtils';

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

export const SitterProfilePage: React.FC = () => {
    const { formatMessage } = useIntl();
    const location = useLocation();
    const { userId } = useAppSelector(x => x.profileReducer);
    const userKey = `sitter-profile-${userId}`;

    const [currentTab, setCurrentTab] = useState(() => {
        return location.state?.defaultTab === 'professional' ? 1 : location.state?.defaultTab === 'reviews' ? 2 : 0;
    });

    const { data: userData, isLoading: isLoadingUser, isError: isErrorUser, refetch: refetchUser } = useGetUser(userId);
    // For SitterProfile, isLoadingSitterProfile will be true initially, then false.
    // isErrorSitterProfile will be true if a 404 (or other error) occurs.
    // sitterProfileData will be undefined if 404.
    const { data: sitterProfileData, isLoading: isLoadingSitterProfile, isError: isErrorSitterProfile, refetch: refetchSitterProfile } = useGetMySitterProfile();
    const { data: reviewsData, isLoading: isLoadingReviews, isError: isErrorReviews, refetch: refetchReviews } = useGetReviewsForSitter(userId);

    useEffect(() => {
        if (userId) {
            refetchUser();
            refetchSitterProfile();
            refetchReviews();
        }
    }, [userId, refetchUser, refetchSitterProfile, refetchReviews]);

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    const hasExistingSitterProfile = !!sitterProfileData?.response;

    const reviews = reviewsData?.response || [];
    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
        : 0;

    return (
        <Fragment>
            <Seo title={formatMessage({ id: 'profile.sitter.title' })} />
            <WebsiteLayout>
                <Container maxWidth="lg">
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
                            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                                {/* Sidebar loading depends on user and profile data */}
                                <DataLoadingContainer isLoading={isLoadingUser || isLoadingSitterProfile} isError={isErrorUser} tryReload={() => { refetchUser(); refetchSitterProfile();}}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                                        <Avatar
                                            sx={{ width: 100, height: 100, mb: 2, bgcolor: 'secondary.main', fontSize: '2.5rem' }}
                                        >
                                            {userData?.response?.name?.[0]?.toUpperCase() || 'S'}
                                        </Avatar>
                                        <Typography variant="h5" gutterBottom align="center">
                                            {userData?.response?.name || formatMessage({ id: 'globals.sitter' })}
                                        </Typography>
                                        {hasExistingSitterProfile && (
                                            <>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <Rating value={averageRating} precision={0.5} readOnly size="small" />
                                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                                        ({reviewCount})
                                                    </Typography>
                                                </Box>
                                                {sitterProfileData?.response?.location && (
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                                    >
                                                        <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                                                        {sitterProfileData.response.location}
                                                    </Typography>
                                                )}
                                            </>
                                        )}
                                    </Box>
                                    <Divider sx={{ my: 2 }} />
                                    {hasExistingSitterProfile && sitterProfileData?.response && (
                                        <Box>
                                            {sitterProfileData.response.hourlyRate && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <AttachMoneyIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
                                                    <Typography variant="body2">
                                                        <strong>{formatMessage({ id: 'labels.hourlyRate' })}:</strong> ${sitterProfileData.response.hourlyRate}
                                                    </Typography>
                                                </Box>
                                            )}
                                            {sitterProfileData.response.yearsExperience !== undefined && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <SchoolIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
                                                    <Typography variant="body2">
                                                        <strong>{formatMessage({ id: 'labels.yearsExperience' })}:</strong> {sitterProfileData.response.yearsExperience} years
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                </DataLoadingContainer>
                                {/* Show this alert if profile is done loading AND no profile exists (hasExistingSitterProfile is false) */}
                                {!isLoadingSitterProfile && !hasExistingSitterProfile && (
                                    <Alert severity="warning" sx={{ mt: 2 }}>
                                        <Typography variant="body2">
                                            <FormattedMessage id="profile.sitter.professional.noProfile" />
                                        </Typography>
                                    </Alert>
                                )}
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={9}>
                            <Typography variant="h4" component="h1" gutterBottom>
                                <FormattedMessage id="profile.sitter.header" />
                            </Typography>
                            <Paper elevation={2} sx={{ overflow: 'hidden' }}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs
                                        value={currentTab}
                                        onChange={handleChangeTab}
                                        aria-label="sitter profile tabs"
                                        variant="fullWidth"
                                    >
                                        <Tab
                                            label={formatMessage({id: "profile.sitter.tab.account"})}
                                            icon={<AccountCircleIcon />}
                                            iconPosition="start"
                                            {...a11yProps(0)}
                                        />
                                        <Tab
                                            label={formatMessage({id: "profile.sitter.tab.professional"})}
                                            icon={<WorkIcon />}
                                            iconPosition="start"
                                            {...a11yProps(1)}
                                        />
                                        <Tab
                                            label={formatMessage({id: "sitter.reviews.title"})}
                                            icon={<RateReviewIcon />}
                                            iconPosition="start"
                                            {...a11yProps(2)}
                                        />
                                    </Tabs>
                                </Box>

                                <TabPanel value={currentTab} index={0}>
                                    <DataLoadingContainer isLoading={isLoadingUser} isError={isErrorUser} tryReload={refetchUser}>
                                        <Box p={{xs:2, md:3}}>
                                            {userData?.response && (
                                                <UserUpdateForm
                                                    key={`${userKey}-account`}
                                                    initialData={{
                                                        name: userData.response.name || "",
                                                        email: userData.response.email || "",
                                                        phone: userData.response.phone || "",
                                                    }}
                                                    onSubmitSuccess={() => refetchUser()}
                                                />
                                            )}
                                        </Box>
                                    </DataLoadingContainer>
                                </TabPanel>

                                <TabPanel value={currentTab} index={1}>
                                    <Box p={{xs:2, md:3}}>
                                        {isLoadingSitterProfile && ( // Only show spinner if actively loading
                                            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200}}>
                                                <CircularProgress />
                                            </Box>
                                        )}
                                        {/* Render form if not loading. isErrorSitterProfile might be true for 404, but form still needs to show. */}
                                        {/* SitterProfileForm itself can handle initialData being undefined for create mode. */}
                                        {!isLoadingSitterProfile && (
                                            <SitterProfileForm
                                                key={`${userKey}-professional-${hasExistingSitterProfile ? 'edit' : 'create'}`}
                                                initialData={sitterProfileData?.response || undefined}
                                                hasExistingProfile={hasExistingSitterProfile}
                                                onSubmitSuccess={() => refetchSitterProfile()}
                                            />
                                        )}
                                        {/* If there was an error OTHER than a 404 (i.e., sitterProfileData is undefined AND it was an error) */}
                                        {/* This condition is tricky because isErrorSitterProfile is true for 404s.
                                            We rely on the ToastNotifier to suppress the 404 toast.
                                            If it's a non-404 error, the form might not load due to data dependency issues,
                                            but SitterProfileForm is quite self-contained for creation.
                                            If the SitterProfileForm *itself* had critical data dependencies that could fail
                                            and prevent rendering, then a more specific error boundary or condition here would be needed.
                                            For now, letting the form render and potentially show its own internal error/loading
                                            if it had any more complex internal fetches seems okay.
                                        */}
                                    </Box>
                                </TabPanel>

                                <TabPanel value={currentTab} index={2}>
                                    <DataLoadingContainer isLoading={isLoadingReviews} isError={isErrorReviews} tryReload={refetchReviews}>
                                        <Box p={{xs:2, md:3}}>
                                            {reviewCount > 0 ? (
                                                <>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                                        <Paper elevation={2} sx={{ p: 3, mr: 3, textAlign: 'center', minWidth: 120 }}>
                                                            <Typography variant="h3" color="primary">{averageRating.toFixed(1)}</Typography>
                                                            <Rating value={averageRating} precision={0.1} readOnly />
                                                        </Paper>
                                                        <Typography variant="h6">
                                                            <FormattedMessage id="sitter.reviews.totalReviews" values={{count: reviewCount}} />
                                                        </Typography>
                                                    </Box>
                                                    <Grid container spacing={2}>
                                                        {reviews.map(review => (
                                                            <Grid item xs={12} key={review.id}>
                                                                <Card elevation={1} sx={{ mb: 2 }}>
                                                                    <CardContent>
                                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                                            <Rating value={review.rating} readOnly />
                                                                            <Typography variant="caption" color="text.secondary">
                                                                                {dateToDateString(new Date(review.date))}
                                                                            </Typography>
                                                                        </Box>
                                                                        <Typography variant="subtitle2" gutterBottom>
                                                                            <FormattedMessage id="sitter.reviews.fromClient" values={{name: review.reviewerName || 'Anonymous'}}/>
                                                                        </Typography>
                                                                        <Typography variant="body2">{review.comment}</Typography>
                                                                    </CardContent>
                                                                </Card>
                                                            </Grid>
                                                        ))}
                                                    </Grid>
                                                </>
                                            ) : (
                                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                                    <Typography variant="h6" color="text.secondary">
                                                        <FormattedMessage id="sitter.reviews.noReviews" />
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </DataLoadingContainer>
                                </TabPanel>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </WebsiteLayout>
        </Fragment>
    );
};