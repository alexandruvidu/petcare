import React, { Fragment, useEffect, useState } from 'react';
import { WebsiteLayout } from "@presentation/layouts/WebsiteLayout";
import { Seo } from "@presentation/components/ui/Seo";
import { useIntl, FormattedMessage } from 'react-intl';
import { Container, Typography, Grid, Paper, Box, Button, Alert, CircularProgress } from '@mui/material'; // Added CircularProgress
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppRoute } from 'routes';
import EventNoteIcon from '@mui/icons-material/EventNote';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { useGetMyBookings, useGetReviewsForSitter, useGetMySitterProfile } from '@infrastructure/apis/api-management';
import { BookingDTO, BookingStatusEnum } from '@infrastructure/apis/client';
import { DataLoadingContainer } from '@presentation/components/ui/LoadingDisplay';


interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    linkTo: AppRoute;
    linkText: string;
    subValue?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, linkTo, linkText, subValue }) => (
    <Grid item xs={12} sm={6} md={4} lg={3}>
        <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <Box sx={{ color: 'primary.main', mb: 1 }}>{icon}</Box>
            <Typography variant="h6" component="h3" gutterBottom align="center">{title}</Typography>
            <Typography variant="h4" component="p" fontWeight="bold" color="primary">{value}</Typography>
            {subValue && <Typography variant="caption" color="text.secondary">{subValue}</Typography>}
            <Button component={RouterLink} to={linkTo} sx={{ mt: 'auto' }}>{linkText}</Button>
        </Paper>
    </Grid>
);

interface QuickActionCardProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    linkTo?: AppRoute;
    onClick?: () => void;
}
const QuickActionCard: React.FC<QuickActionCardProps> = ({ title, subtitle, icon, linkTo, onClick}) => (
    <Grid item xs={12} md={4}>
        <Paper
            component={linkTo ? RouterLink : 'div'}
            to={linkTo}
            onClick={onClick}
            elevation={2}
            sx={{
                p: 2, display: 'flex', alignItems: 'center',
                textDecoration: 'none', color: 'inherit',
                cursor: onClick || linkTo ? 'pointer' : 'default',
                '&:hover': { boxShadow: onClick || linkTo ? 4 : 2 }
            }}
        >
            <Box sx={{ color: 'primary.main', mr: 2, p:1, borderRadius: '50%', backgroundColor: (theme) => theme.palette.action.hover }}>{icon}</Box>
            <Box>
                <Typography variant="subtitle1" fontWeight="medium">{title}</Typography>
                <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
            </Box>
        </Paper>
    </Grid>
);


export const SitterDashboard: React.FC = () => {
    const { formatMessage } = useIntl();
    const navigate = useNavigate();
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : { name: "Sitter", id: "" };

    const { data: bookingsData, isLoading: isLoadingBookings, isError: isErrorBookings, refetch: refetchBookings } = useGetMyBookings();
    const { data: reviewsData, isLoading: isLoadingReviews, isError: isErrorReviews, refetch: refetchReviews } = useGetReviewsForSitter(user.id);
    const { data: profileData, isLoading: isLoadingProfile, isError: isErrorProfile, refetch: refetchProfile } = useGetMySitterProfile();

    const profileComplete = !!profileData?.response?.bio;

    const isLoadingStats = isLoadingBookings || isLoadingReviews;
    const isErrorStats = isErrorBookings || isErrorReviews;

    const refetchAllData = () => {
        refetchBookings();
        refetchReviews();
        refetchProfile();
    }

    const activeBookings = bookingsData?.response?.filter(b => b.status === BookingStatusEnum.Accepted && new Date(b.endDate) >= new Date()).length || 0;
    const pendingBookings = bookingsData?.response?.filter(b => b.status === BookingStatusEnum.Pending).length || 0;
    const upcomingBookings = bookingsData?.response?.filter(b => b.status === BookingStatusEnum.Accepted && new Date(b.startDate) > new Date()).length || 0;
    const completedBookings = bookingsData?.response?.filter(b => b.status === BookingStatusEnum.Completed).length || 0;

    const reviewCount = reviewsData?.response?.length || 0;
    const averageRating = reviewCount > 0
        ? (reviewsData!.response!.reduce((sum, review) => sum + (review.rating || 0), 0) / reviewCount).toFixed(1)
        : "0.0";

    const goToProfilePageWithProfessionalTab = () => {
        navigate(AppRoute.Profile, { state: { defaultTab: 'professional' } });
    };

    return (
        <Fragment>
            <Seo title={formatMessage({ id: 'sitter.dashboard.title' })} />
            <WebsiteLayout>
                <Container maxWidth="lg" sx={{py: 2}}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        <FormattedMessage id="sitter.dashboard.welcome" values={{ name: user.name }} />
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        <FormattedMessage id="sitter.dashboard.subtitle" />
                    </Typography>

                    {/* Profile Completion Alert placeholder or actual alert */}
                    {isLoadingProfile ? (
                        <Paper sx={{p:2, my:3, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'action.hover', borderRadius: 1 }}>
                            <CircularProgress size={20} sx={{mr: 2}}/>
                            <Typography color="text.secondary">Checking profile status...</Typography> {/* TODO: Add i18n for this */}
                        </Paper>
                    ) : !profileComplete ? ( // Only show if loading is done and profile is not complete
                        <Alert severity="warning" sx={{p:2, my:3 }}
                               action={
                                   <Button color="inherit" size="small" onClick={goToProfilePageWithProfessionalTab}>
                                       <FormattedMessage id="sitter.dashboard.profilePrompt.button" />
                                   </Button>
                               }
                        >
                            <Typography fontWeight="medium"><FormattedMessage id="sitter.dashboard.profilePrompt.title" /></Typography>
                            <FormattedMessage id="sitter.dashboard.profilePrompt.subtitle" />
                        </Alert>
                    ) : null}


                    <DataLoadingContainer isLoading={isLoadingStats} isError={isErrorStats} tryReload={refetchAllData}>
                        <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
                            <StatCard
                                title={formatMessage({id: "sitter.dashboard.stats.activeBookings"})}
                                value={`${activeBookings} Active / ${pendingBookings} Pending`}
                                icon={<EventNoteIcon fontSize="large"/>}
                                linkTo={AppRoute.SitterBookings}
                                linkText={formatMessage({id: "sitter.dashboard.actions.manageBookings"})}
                            />
                            <StatCard
                                title={formatMessage({id: "sitter.dashboard.stats.upcomingBookings"})}
                                value={upcomingBookings}
                                icon={<EventNoteIcon fontSize="large" color="secondary"/>}
                                linkTo={AppRoute.SitterBookings}
                                linkText={formatMessage({id: "sitter.dashboard.actions.viewSchedule"})}
                            />
                            <StatCard
                                title={formatMessage({id: "sitter.dashboard.stats.completedBookings"})}
                                value={completedBookings}
                                icon={<EventNoteIcon fontSize="large" color="action"/>}
                                linkTo={AppRoute.SitterBookings}
                                linkText={formatMessage({id: "sitter.dashboard.actions.viewHistory"})}
                            />
                            <StatCard
                                title={formatMessage({id: "sitter.dashboard.stats.averageRating"})}
                                value={averageRating}
                                icon={<StarIcon fontSize="large" sx={{color: 'gold'}}/>}
                                linkTo={AppRoute.SitterReviews}
                                linkText={formatMessage({id: "sitter.dashboard.actions.viewReviews"})}
                                subValue={formatMessage({id: "sitter.dashboard.stats.reviewCount"}, {count: reviewCount})}
                            />
                        </Grid>
                    </DataLoadingContainer>

                    <Box sx={{ my: 4 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            <FormattedMessage id="sitter.dashboard.quickActions.title" />
                        </Typography>
                        <Grid container spacing={3}>
                            <QuickActionCard
                                title={formatMessage({id: "sitter.dashboard.quickActions.manageBookings.title"})}
                                subtitle={formatMessage({id: "sitter.dashboard.quickActions.manageBookings.subtitle"})}
                                icon={<AssignmentIndIcon />}
                                linkTo={AppRoute.SitterBookings}
                            />
                            <QuickActionCard
                                title={formatMessage({id: "sitter.dashboard.quickActions.updateProfile.title"})}
                                subtitle={formatMessage({id: "sitter.dashboard.quickActions.updateProfile.subtitle"})}
                                icon={<PersonIcon />}
                                onClick={goToProfilePageWithProfessionalTab}
                            />
                            <QuickActionCard
                                title={formatMessage({id: "sitter.dashboard.quickActions.viewReviews.title"})}
                                subtitle={formatMessage({id: "sitter.dashboard.quickActions.viewReviews.subtitle"})}
                                icon={<StarIcon />}
                                linkTo={AppRoute.SitterReviews}
                            />
                        </Grid>
                    </Box>
                </Container>
            </WebsiteLayout>
        </Fragment>
    );
};