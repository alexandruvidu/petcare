import React from 'react';
import {
    Box,
    Typography,
    Button,
    Container,
    Grid,
    Card,
    Avatar,
    Paper // Used instead of Card for CTA for slight visual difference
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { WebsiteLayout } from '@presentation/layouts/WebsiteLayout';
import { useIntl, FormattedMessage } from 'react-intl';
import { AppRoute } from 'routes';
import { Seo } from '@presentation/components/ui/Seo';
import PetsIcon from '@mui/icons-material/Pets';
import MessageIcon from '@mui/icons-material/Message'; // Trust & Transparency
import PublicIcon from '@mui/icons-material/Public';   // Community
import FlashOnIcon from '@mui/icons-material/FlashOn'; // Innovation

// i18n keys to add:
// about.title: "PetCare | About Us"
// about.hero.title: "About PetCare"
// about.hero.subtitle: "Our mission is to make pet care easy, accessible, and worry-free for all pet owners."
// about.story.title: "Our Story"
// about.story.p1: "PetCare was founded in 2023 by a group of passionate pet owners who recognized the challenges of finding reliable pet care. We understood the anxiety that comes with leaving your beloved pets in someone else's hands."
// about.story.p2: "What started as a small community of pet lovers has grown into a comprehensive platform connecting thousands of pet owners with trusted pet sitters across the country."
// about.story.p3: "Our team consists of veterinarians, animal behaviorists, and technology experts all working together to create the best experience for pets and their owners."
// about.values.overline: "Our Values"
// about.values.title: "What We Believe In"
// about.values.subtitle: "Our core values guide everything we do at PetCare, from how we build our platform to how we interact with our community."
// about.values.safety.title: "Pet Safety & Wellbeing"
// about.values.safety.description: "We prioritize the safety, health, and happiness of all pets in our care. Every decision we make puts pets first."
// about.values.trust.title: "Trust & Transparency"
// about.values.trust.description: "We believe in building trust through transparency. From our verification process to our review system, we ensure pet owners can make informed decisions."
// about.values.community.title: "Community"
// about.values.community.description: "We're building more than a service - we're creating a community of pet lovers who share knowledge, experiences, and a passion for animals."
// about.values.innovation.title: "Innovation"
// about.values.innovation.description: "We continuously improve our platform and services based on user feedback and emerging technologies to provide the best experience for pets and their owners."
// about.cta.title: "Ready to join our community?"
// about.cta.subtitle: "Start using PetCare today."
// about.cta.getStarted: "Get started"
// about.cta.giveFeedback: "Give feedback" (Assuming a feedback page exists or link to contact)

const heroImage = "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80";
const teamImage = "https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";

export const AboutPage = () => {
    const { formatMessage } = useIntl();

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
                            backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker overlay for better text contrast
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
                <Box sx={{ bgcolor: 'grey.100', py: 8, mb: 8 }}> {/* Adjusted background color */}
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
                                <Typography variant="h6" color="primary.main" gutterBottom> {/* h5 in petcare, h6 here */}
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
                                    {/* Assuming a feedback route/page or link to contact */}
                                    <Button
                                        component={RouterLink}
                                        to={AppRoute.Index} // Placeholder, change to actual feedback route
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