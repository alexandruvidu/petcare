import React, { useEffect } from 'react'; // Added useEffect
import {
    Box,
    Typography,
    Button,
    Container,
    Grid,
    Card,
    Avatar,
    Paper
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // Added useNavigate
import { WebsiteLayout } from '@presentation/layouts/WebsiteLayout';
import { useIntl, FormattedMessage } from 'react-intl';
import { AppRoute } from 'routes';
import { Seo } from '@presentation/components/ui/Seo';
import PetsIcon from '@mui/icons-material/Pets';
import MessageIcon from '@mui/icons-material/Message';
import PublicIcon from '@mui/icons-material/Public';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { useTokenHasExpired } from '@infrastructure/hooks/useOwnUser'; // Added
import { useAppSelector } from '@application/store'; // Added
import { UserRoleEnum } from '@infrastructure/apis/client'; // Added

const heroImage = "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80";
const teamImage = "https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";

export const AboutPage = () => {
    const { formatMessage } = useIntl();
    const navigate = useNavigate();
    const { loggedIn } = useTokenHasExpired();
    const { role } = useAppSelector(state => state.profileReducer);

    useEffect(() => {
        if (loggedIn) {
            if (role === UserRoleEnum.Client) {
                navigate(AppRoute.ClientDashboard, { replace: true });
            } else if (role === UserRoleEnum.Sitter) {
                navigate(AppRoute.SitterDashboard, { replace: true });
            } else if (role === UserRoleEnum.Admin) {
                navigate(AppRoute.AdminUsers, { replace: true }); // Or a specific AdminDashboard route
            }
        }
    }, [loggedIn, role, navigate]);

    if (loggedIn) { // Render nothing while redirecting
        return null;
    }

    const values = [
        { icon: <PetsIcon />, titleId: "about.values.safety.title", descriptionId: "about.values.safety.description" },
        { icon: <MessageIcon />, titleId: "about.values.trust.title", descriptionId: "about.values.trust.description" },
        { icon: <PublicIcon />, titleId: "about.values.community.title", descriptionId: "about.values.community.description" },
        { icon: <FlashOnIcon />, titleId: "about.values.innovation.title", descriptionId: "about.values.innovation.description" }
    ];

    return (
        <>
            <Seo title={formatMessage({id: "about.title"})} />
            <WebsiteLayout>
                {/* Header */}
                <Paper
                    sx={{
                        position: 'relative',
                        backgroundColor: 'grey.800',
                        color: '#fff',
                        mb: 8,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundImage: `url(${heroImage})`,
                        height: { xs: '300px', md: '400px' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        borderRadius: 2,
                        boxShadow: 3,
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0, left: 0, width: '100%', height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            borderRadius: 'inherit'
                        }}
                    />
                    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                        <Typography component="h1" variant="h2" color="inherit" gutterBottom fontWeight="bold">
                            <FormattedMessage id="about.hero.title" />
                        </Typography>
                        <Typography variant="h5" color="inherit" paragraph sx={{ maxWidth: 'md', mx: 'auto', opacity: 0.9 }}>
                            <FormattedMessage id="about.hero.subtitle" />
                        </Typography>
                    </Container>
                </Paper>

                {/* Our Story */}
                <Container maxWidth="lg" sx={{ mb: 8 }}>
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography component="h2" variant="h3" fontWeight="bold" gutterBottom>
                                <FormattedMessage id="about.story.title" />
                            </Typography>
                            <Typography variant="body1" paragraph>
                                <FormattedMessage id="about.story.p1" />
                            </Typography>
                            <Typography variant="body1" paragraph>
                                <FormattedMessage id="about.story.p2" />
                            </Typography>
                            <Typography variant="body1">
                                <FormattedMessage id="about.story.p3" />
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box
                                component="img"
                                src={teamImage}
                                alt={formatMessage({id: "about.story.title"})}
                                sx={{ width: '100%', height: 'auto', borderRadius: 2, boxShadow: 3 }}
                            />
                        </Grid>
                    </Grid>
                </Container>

                {/* Our Values */}
                <Box sx={{ bgcolor: 'grey.100', py: 8, mb: 8 }}>
                    <Container maxWidth="lg">
                        <Box sx={{ textAlign: 'center', mb: 6 }}>
                            <Typography variant="overline" color="primary.main" fontWeight="bold">
                                <FormattedMessage id="about.values.overline" />
                            </Typography>
                            <Typography component="h2" variant="h3" fontWeight="bold" sx={{ mt: 1, mb: 2 }}>
                                <FormattedMessage id="about.values.title" />
                            </Typography>
                            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 'md', mx: 'auto' }}>
                                <FormattedMessage id="about.values.subtitle" />
                            </Typography>
                        </Box>

                        <Grid container spacing={4}>
                            {values.map((value, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                                        <Avatar sx={{ bgcolor: 'primary.main', width: 50, height: 50, mr: 2, mt: 0.5 }}>
                                            {value.icon}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" fontWeight="medium" gutterBottom>
                                                <FormattedMessage id={value.titleId} />
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary">
                                                <FormattedMessage id={value.descriptionId} />
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>

                {/* CTA */}
                <Container maxWidth="lg" sx={{ mb: 6 }}>
                    <Paper elevation={3} sx={{ bgcolor: 'white', p: {xs: 3, md:4}, borderRadius: 2 }}>
                        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
                            <Grid item xs={12} md={8}>
                                <Typography variant="h4" component="h3" fontWeight="bold" gutterBottom>
                                    <FormattedMessage id="about.cta.title" />
                                </Typography>
                                <Typography variant="h6" color="primary.main" gutterBottom>
                                    <FormattedMessage id="about.cta.subtitle" />
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' }}}>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                                    <Button
                                        component={RouterLink}
                                        to={AppRoute.Register}
                                        variant="contained"
                                        size="large"
                                        color="primary"
                                    >
                                        <FormattedMessage id="about.cta.getStarted" />
                                    </Button>
                                    <Button
                                        component={RouterLink}
                                        to={AppRoute.Index}
                                        variant="outlined"
                                        size="large"
                                        color="primary"
                                    >
                                        <FormattedMessage id="about.cta.giveFeedback" />
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Container>
            </WebsiteLayout>
        </>
    );
};