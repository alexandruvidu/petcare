import React from 'react';
import {
    Box,
    Typography,
    Button,
    Container,
    Grid,
    Card,
    CardContent,
    useTheme,
    useMediaQuery,
    Paper
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { WebsiteLayout } from '@presentation/layouts/WebsiteLayout';
import { useIntl, FormattedMessage } from 'react-intl';
import { AppRoute } from 'routes';
import PetsIcon from '@mui/icons-material/Pets';
import HomeIcon from '@mui/icons-material/Home'; // Represents Boarding
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'; // Represents Dog Walking
import { Seo } from '@presentation/components/ui/Seo';

// i18n keys to add:
// home.title: "PetCare | Home"
// home.hero.title: "Caring for your pets when you can't"
// home.hero.subtitle: "PetCare connects pet owners with trusted pet sitters in your area. Whether it's a day, a weekend, or longer - your pets will receive the care they deserve."
// home.hero.getStarted: "Get Started"
// home.hero.learnMore: "Learn More"
// home.services.overline: "Our Services"
// home.services.title: "Everything your pet needs"
// home.services.subtitle: "From walks and feeding to overnight stays, our sitters provide the best care for your furry friends."
// home.services.petSitting.title: "Pet Sitting"
// home.services.petSitting.description: "Our pet sitters can visit your home to feed, play with, and care for your pets while you're away."
// home.services.boarding.title: "Boarding"
// home.services.boarding.description: "Your pet can stay at a sitter's home, receiving 24/7 attention and care in a safe environment."
// home.services.dogWalking.title: "Dog Walking"
// home.services.dogWalking.description: "Regular walks keep your dog happy and healthy, providing exercise and mental stimulation."
// home.cta.title: "Ready to find the perfect pet sitter?"
// home.cta.subtitle: "Join thousands of satisfied pet owners who trust PetCare with their furry, feathered, and scaly friends."
// home.cta.signUp: "Sign up for free"

export const HomePage = () => {
    const { formatMessage } = useIntl();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const heroImage = "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80";

    return (
        <>
            <Seo title={formatMessage({id: "home.title"})} />
            <WebsiteLayout>
                {/* Hero Section */}
                <Paper
                    sx={{
                        position: 'relative',
                        backgroundColor: 'grey.800',
                        color: '#fff',
                        mb: 4,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundImage: `url(${heroImage})`,
                        height: { xs: '60vh', md: '70vh' },
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: 2, // Match Petcare
                        boxShadow: 3
                    }}
                >
                    {/* Overlay */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            right: 0,
                            left: 0,
                            backgroundColor: 'rgba(0,50,150,0.7)', // Similar to Petcare's blue overlay
                            borderRadius: 'inherit'
                        }}
                    />
                    <Container maxWidth="md"> {/* Adjusted maxWidth for better text layout */}
                        <Box sx={{ position: 'relative', p: { xs: 3, md: 6 } }}>
                            <Typography component="h1" variant={isMobile ? "h3" : "h2"} color="inherit" gutterBottom fontWeight="bold">
                                <FormattedMessage id="home.hero.title" />
                            </Typography>
                            <Typography variant="h6" color="inherit" paragraph sx={{opacity: 0.9}}>
                                <FormattedMessage id="home.hero.subtitle" />
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 4 }}>
                                <Button
                                    component={RouterLink}
                                    to={AppRoute.Register}
                                    variant="contained"
                                    size="large"
                                    sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                                >
                                    <FormattedMessage id="home.hero.getStarted" />
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to={AppRoute.About}
                                    variant="outlined"
                                    size="large"
                                    sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)'} }}
                                >
                                    <FormattedMessage id="home.hero.learnMore" />
                                </Button>
                            </Box>
                        </Box>
                    </Container>
                </Paper>

                {/* Features Section */}
                <Box sx={{ py: 8, bgcolor: 'grey.50', borderRadius: 2, mb: 8 }}>
                    <Container>
                        <Box sx={{ textAlign: 'center', mb: 6 }}>
                            <Typography variant="overline" color="primary.main" fontWeight="bold">
                                <FormattedMessage id="home.services.overline" />
                            </Typography>
                            <Typography component="h2" variant="h3" fontWeight="bold" sx={{ mt: 1, mb: 2 }}>
                                <FormattedMessage id="home.services.title" />
                            </Typography>
                            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 'md', mx: 'auto' }}>
                                <FormattedMessage id="home.services.subtitle" />
                            </Typography>
                        </Box>

                        <Grid container spacing={4}>
                            {[
                                { icon: <PetsIcon fontSize="large" />, titleId: "home.services.petSitting.title", descriptionId: "home.services.petSitting.description" },
                                { icon: <HomeIcon fontSize="large" />, titleId: "home.services.boarding.title", descriptionId: "home.services.boarding.description" },
                                { icon: <DirectionsRunIcon fontSize="large" />, titleId: "home.services.dogWalking.title", descriptionId: "home.services.dogWalking.description" }
                            ].map((feature, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: 2, border: '1px solid', borderColor: 'grey.200' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'primary.main', color: 'white', width: 60, height: 60, borderRadius: 2, boxShadow: 2 }}>
                                                {feature.icon}
                                            </Box>
                                        </Box>
                                        <CardContent sx={{ flexGrow: 1, pt: 4, textAlign: 'center' }}>
                                            <Typography gutterBottom variant="h5" component="h3">
                                                <FormattedMessage id={feature.titleId} />
                                            </Typography>
                                            <Typography>
                                                <FormattedMessage id={feature.descriptionId} />
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>

                {/* CTA Section */}
                <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8, borderRadius: 2, mb: 6, boxShadow: 3 }}>
                    <Container maxWidth="md"> {/* Adjusted maxWidth */}
                        <Grid container justifyContent="center" textAlign="center">
                            <Grid item xs={12}>
                                <Typography variant={isMobile ? "h4" : "h3"} component="h2" fontWeight="bold" gutterBottom>
                                    <FormattedMessage id="home.cta.title" />
                                </Typography>
                                <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                                    <FormattedMessage id="home.cta.subtitle" />
                                </Typography>
                                <Button
                                    component={RouterLink}
                                    to={AppRoute.Register}
                                    variant="contained"
                                    size="large"
                                    sx={{ bgcolor: 'white', color: 'primary.main', px: 4, '&:hover': { bgcolor: 'grey.100' } }}
                                >
                                    <FormattedMessage id="home.cta.signUp" />
                                </Button>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </WebsiteLayout>
        </>
    );
};