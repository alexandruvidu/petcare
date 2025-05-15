import React, { Fragment } from 'react';
import { WebsiteLayout } from "@presentation/layouts/WebsiteLayout";
import { Seo } from "@presentation/components/ui/Seo";
import { useIntl, FormattedMessage } from 'react-intl';
import { Container, Typography, Grid, Paper, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { AppRoute } from 'routes';
import PetsIcon from '@mui/icons-material/Pets';
import EventNoteIcon from '@mui/icons-material/EventNote'; // For Bookings
import GroupIcon from '@mui/icons-material/Group'; // For Sitters
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useGetMyPets } from '@infrastructure/apis/api-management/pet';
import { useGetMyBookings } from '@infrastructure/apis/api-management/booking';
import { DataLoadingContainer } from '@presentation/components/ui/LoadingDisplay';

// i18n keys:
// client.dashboard.title: "Client Dashboard"
// client.dashboard.welcome: "Welcome, {name}!"
// client.dashboard.subtitle: "Manage your pets and bookings from your dashboard."
// client.dashboard.stats.myPets: "My Pets"
// client.dashboard.stats.activeBookings: "Active Bookings"
// client.dashboard.stats.completedBookings: "Completed Bookings"
// client.dashboard.actions.managePets: "Manage Pets"
// client.dashboard.actions.viewBookings: "View Bookings"
// client.dashboard.actions.viewHistory: "View History"
// client.dashboard.quickActions.title: "Quick Actions"
// client.dashboard.quickActions.addPet.title: "Add a New Pet"
// client.dashboard.quickActions.addPet.subtitle: "Register your pet's information"
// client.dashboard.quickActions.bookSitter.title: "Book a Pet Sitter"
// client.dashboard.quickActions.bookSitter.subtitle: "Schedule a new booking"
// client.dashboard.quickActions.findSitters.title: "Find Pet Sitters"
// client.dashboard.quickActions.findSitters.subtitle: "Browse available sitters"
// client.dashboard.feedback.title: "We Value Your Feedback"
// client.dashboard.feedback.subtitle: "Help us improve your experience by sharing your thoughts."
// client.dashboard.feedback.button: "Give Feedback"

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    linkTo: AppRoute;
    linkText: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, linkTo, linkText }) => (
    <Grid item xs={12} sm={6} md={4}>
        <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <Box sx={{ color: 'primary.main', mb: 1 }}>{icon}</Box>
            <Typography variant="h6" component="h3" gutterBottom>{title}</Typography>
            <Typography variant="h4" component="p" fontWeight="bold" color="primary">{value}</Typography>
            <Button component={RouterLink} to={linkTo} sx={{ mt: 'auto' }}>{linkText}</Button>
        </Paper>
    </Grid>
);

interface QuickActionCardProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    linkTo: AppRoute;
}
const QuickActionCard: React.FC<QuickActionCardProps> = ({ title, subtitle, icon, linkTo}) => (
    <Grid item xs={12} md={4}>
        <Paper component={RouterLink} to={linkTo} elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', '&:hover': { boxShadow: 4 }}}>
            <Box sx={{ color: 'primary.main', mr: 2, p:1, borderRadius: '50%', backgroundColor: (theme) => theme.palette.action.hover }}>{icon}</Box>
            <Box>
                <Typography variant="subtitle1" fontWeight="medium">{title}</Typography>
                <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
            </Box>
        </Paper>
    </Grid>
);


export const ClientDashboard: React.FC = () => {
    const { formatMessage } = useIntl();
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : { name: "User" };

    const { data: petsData, isLoading: isLoadingPets, isError: isErrorPets, refetch: refetchPets } = useGetMyPets();
    const { data: bookingsData, isLoading: isLoadingBookings, isError: isErrorBookings, refetch: refetchBookings } = useGetMyBookings();

    const isLoading = isLoadingPets || isLoadingBookings;
    const isError = isErrorPets || isErrorBookings;
    const refetchAll = () => { refetchPets(); refetchBookings(); }

    const petCount = petsData?.response?.length || 0;
    const activeBookings = bookingsData?.response?.filter(b => b.status === "Pending" || b.status === "Accepted").length || 0;
    const completedBookings = bookingsData?.response?.filter(b => b.status === "Completed").length || 0;

    return (
        <Fragment>
            <Seo title={formatMessage({ id: 'client.dashboard.title' })} />
            <WebsiteLayout>
                <Container maxWidth="lg" sx={{py: 2}}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        <FormattedMessage id="client.dashboard.welcome" values={{ name: user.name }} />
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        <FormattedMessage id="client.dashboard.subtitle" />
                    </Typography>

                    <DataLoadingContainer isLoading={isLoading} isError={isError} tryReload={refetchAll}>
                        <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
                            <StatCard
                                title={formatMessage({id: "client.dashboard.stats.myPets"})}
                                value={petCount}
                                icon={<PetsIcon fontSize="large"/>}
                                linkTo={AppRoute.ClientPets}
                                linkText={formatMessage({id: "client.dashboard.actions.managePets"})}
                            />
                            <StatCard
                                title={formatMessage({id: "client.dashboard.stats.activeBookings"})}
                                value={activeBookings}
                                icon={<EventNoteIcon fontSize="large"/>}
                                linkTo={AppRoute.ClientBookings}
                                linkText={formatMessage({id: "client.dashboard.actions.viewBookings"})}
                            />
                            <StatCard
                                title={formatMessage({id: "client.dashboard.stats.completedBookings"})}
                                value={completedBookings}
                                icon={<EventNoteIcon fontSize="large" color="action"/>}
                                linkTo={AppRoute.ClientBookings} // Or a filtered view
                                linkText={formatMessage({id: "client.dashboard.actions.viewHistory"})}
                            />
                        </Grid>
                    </DataLoadingContainer>

                    <Box sx={{ my: 4 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            <FormattedMessage id="client.dashboard.quickActions.title" />
                        </Typography>
                        <Grid container spacing={3}>
                            <QuickActionCard
                                title={formatMessage({id: "client.dashboard.quickActions.addPet.title"})}
                                subtitle={formatMessage({id: "client.dashboard.quickActions.addPet.subtitle"})}
                                icon={<AddCircleOutlineIcon />}
                                linkTo={AppRoute.ClientPets} // PetsTable page can handle add modal
                            />
                            <QuickActionCard
                                title={formatMessage({id: "client.dashboard.quickActions.bookSitter.title"})}
                                subtitle={formatMessage({id: "client.dashboard.quickActions.bookSitter.subtitle"})}
                                icon={<EventNoteIcon />}
                                linkTo={AppRoute.Sitters}
                            />
                            <QuickActionCard
                                title={formatMessage({id: "client.dashboard.quickActions.findSitters.title"})}
                                subtitle={formatMessage({id: "client.dashboard.quickActions.findSitters.subtitle"})}
                                icon={<GroupIcon />}
                                linkTo={AppRoute.Sitters}
                            />
                        </Grid>
                    </Box>
                </Container>
            </WebsiteLayout>
        </Fragment>
    );
};