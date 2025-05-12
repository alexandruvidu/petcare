import React, { Fragment, useEffect, useState } from 'react';
import { WebsiteLayout } from "@presentation/layouts/WebsiteLayout";
import { Seo } from "@presentation/components/ui/Seo";
import { useIntl, FormattedMessage } from 'react-intl';
import { Container, Typography, Grid, Paper, Box, Button } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppRoute } from 'routes';
import EventNoteIcon from '@mui/icons-material/EventNote';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { useGetMyBookings, useGetReviewsForSitter, useGetMySitterProfile } from '@infrastructure/apis/api-management';
import { BookingDTO, BookingStatusEnum, UserRoleEnum } from '@infrastructure/apis/client';
import { DataLoadingContainer } from '@presentation/components/ui/LoadingDisplay';

// i18n keys:
// sitter.dashboard.title: "Sitter Dashboard"
// sitter.dashboard.welcome: "Welcome, {name}!"
// sitter.dashboard.subtitle: "Manage your pet sitting bookings and profile."
// sitter.dashboard.stats.activeBookings: "Active/Pending Bookings"
// sitter.dashboard.stats.upcomingBookings: "Upcoming Bookings"
// sitter.dashboard.stats.completedBookings: "Completed Bookings"
// sitter.dashboard.stats.averageRating: "Average Rating"
// sitter.dashboard.stats.reviewCount: "{count} Reviews"
// sitter.dashboard.actions.manageBookings: "Manage Bookings"
// sitter.dashboard.actions.viewSchedule: "View Schedule"
// sitter.dashboard.actions.viewHistory: "View History"
// sitter.dashboard.actions.viewReviews: "View Reviews"
// sitter.dashboard.profilePrompt.title: "Complete Your Sitter Profile"
// sitter.dashboard.profilePrompt.subtitle: "Your profile isn't visible to pet owners yet. Add your bio, experience, and rates to start getting bookings!"
// sitter.dashboard.profilePrompt.button: "Complete Profile"
// sitter.dashboard.quickActions.title: "Quick Actions"
// sitter.dashboard.quickActions.manageBookings.title: "Manage Bookings"
// sitter.dashboard.quickActions.manageBookings.subtitle: "Accept or reject booking requests"
// sitter.dashboard.quickActions.updateProfile.title: "Update Profile"
// sitter.dashboard.quickActions.updateProfile.subtitle: "Edit your bio, rates, and availability"
// sitter.dashboard.quickActions.viewReviews.title: "View Your Reviews"
// sitter.dashboard.quickActions.viewReviews.subtitle: "See feedback from pet owners"

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    linkTo: AppRoute;
    linkText: string;
    subValue?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, linkTo, linkText, subValue }) => (
    <Grid item xs={12} sm={6} md={4} lg={3}> {/* Adjusted for potentially more cards */}
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

    const [profileComplete, setProfileComplete] = useState(false);

    useEffect(() => {
        if (profileData?.response) {
            // Basic check: if bio exists, consider profile somewhat complete. Could be more thorough.
            setProfileComplete(!!profileData.response.bio);
        } else if (!isLoadingProfile && profileData && !profileData.response) { // explicit null response
            setProfileComplete(false);
        }
    }, [profileData, isLoadingProfile]);


    const isLoading = isLoadingBookings || isLoadingReviews || isLoadingProfile;
    const isError = isErrorBookings || isErrorReviews || isErrorProfile;
    const refetchAll = () => { refetchBookings(); refetchReviews(); refetchProfile(); }

    const activeBookings = bookingsData?.response?.filter(b => b.status === BookingStatusEnum.Accepted && new Date(b.endDate) >= new Date()).length || 0;
    const pendingBookings = bookingsData?.response?.filter(b => b.status === BookingStatusEnum.Pending).length || 0;
    const upcomingBookings = bookingsData?.response?.filter(b => b.status === BookingStatusEnum.Accepted && new Date(b.startDate) > new Date()).length || 0;
    const completedBookings = bookingsData?.response?.filter(b => b.status === BookingStatusEnum.Completed).length || 0;

    const reviewCount = reviewsData?.response?.length || 0;
    const averageRating = reviewCount > 0
        ? (reviewsData!.response!.reduce((sum, review) => sum + (review.rating || 0), 0) / reviewCount).toFixed(1)
        : "0.0";

    const goToProfileProfessionalTab = () => {
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

                    {!isLoadingProfile && !profileComplete && (
                        <Paper elevation={2} sx={{p:3, my:3, backgroundColor: 'warning.light', borderColor: 'warning.main', borderWidth:1, borderStyle: 'solid'}}>
                            <Typography variant="h6" color="warning.dark" gutterBottom><FormattedMessage id="sitter.dashboard.profilePrompt.title" /></Typography>
                            <Typography color="warning.dark" paragraph><FormattedMessage id="sitter.dashboard.profilePrompt.subtitle" /></Typography>
                            <Button variant="contained" color="warning" onClick={goToProfileProfessionalTab}>
                                <FormattedMessage id="sitter.dashboard.profilePrompt.button" />
                            </Button>
                        </Paper>
                    )}


                    <DataLoadingContainer isLoading={isLoading} isError={isError} tryReload={refetchAll}>
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
                                onClick={goToProfileProfessionalTab}
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