import React from 'react';
import {
    Box,
    Typography,
    Button,
    Container,
    Grid,
    Card,
    CardContent,
    Avatar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material';
import { Link } from 'react-router-dom';
import { WebsiteLayout } from '@presentation/layouts/WebsiteLayout';
import { useIntl } from 'react-intl';
import { AppRoute } from 'routes';
import { Seo } from '@presentation/components/ui/Seo';
import PetsIcon from '@mui/icons-material/Pets';
import MessageIcon from '@mui/icons-material/Message';
import PublicIcon from '@mui/icons-material/Public';
import FlashOnIcon from '@mui/icons-material/FlashOn';

export const AboutPage = () => {
    const { formatMessage } = useIntl();

    return (
        <>
            <Seo title="PetCare | About Us" />
            <WebsiteLayout>
                {/* Header */}
                <Box
                    sx={{
                        position: 'relative',
                        height: { xs: '300px', md: '400px' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        mb: 8,
                        borderRadius: 2,
                        boxShadow: 3,
                        overflow: 'hidden'
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: -2,
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                zIndex: -1
                            },
                            '& img': {
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }
                        }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                            alt="Various pets"
                        />
                    </Box>

                    <Container maxWidth="lg" sx={{ textAlign: 'center', zIndex: 1 }}>
                        <Typography
                            component="h1"
                            variant="h2"
                            color="inherit"
                            gutterBottom
                            fontWeight="bold"
                        >
                            About PetCare
                        </Typography>
                        <Typography
                            variant="h5"
                            color="inherit"
                            paragraph
                            sx={{ maxWidth: 'md', mx: 'auto', opacity: 0.9 }}
                        >
                            Our mission is to make pet care easy, accessible, and worry-free for all pet owners.
                        </Typography>
                    </Container>
                </Box>

                {/* Our Story */}
                <Container maxWidth="lg" sx={{ mb: 8 }}>
                    <Grid container spacing={8} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography
                                component="h2"
                                variant="h3"
                                fontWeight="bold"
                                gutterBottom
                            >
                                Our Story
                            </Typography>
                            <Typography variant="body1" paragraph>
                                PetCare was founded in 2023 by a group of passionate pet owners who recognized the challenges of finding reliable pet care. We understood the anxiety that comes with leaving your beloved pets in someone else's hands.
                            </Typography>
                            <Typography variant="body1" paragraph>
                                What started as a small community of pet lovers has grown into a comprehensive platform connecting thousands of pet owners with trusted pet sitters across the country.
                            </Typography>
                            <Typography variant="body1">
                                Our team consists of veterinarians, animal behaviorists, and technology experts all working together to create the best experience for pets and their owners.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box
                                component="img"
                                src="https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                alt="Team with pets"
                                sx={{
                                    width: '100%',
                                    height: 'auto',
                                    borderRadius: 2,
                                    boxShadow: 3
                                }}
                            />
                        </Grid>
                    </Grid>
                </Container>

                {/* Our Values */}
                <Box sx={{ bgcolor: 'primary.50', py: 8, mb: 8 }}>
                    <Container maxWidth="lg">
                        <Box sx={{ textAlign: 'center', mb: 6 }}>
                            <Typography
                                component="span"
                                variant="overline"
                                color="primary.main"
                                fontWeight="bold"
                            >
                                Our Values
                            </Typography>
                            <Typography
                                component="h2"
                                variant="h3"
                                fontWeight="bold"
                                sx={{ mt: 1, mb: 2 }}
                            >
                                What We Believe In
                            </Typography>
                            <Typography
                                variant="h6"
                                color="text.secondary"
                                sx={{ maxWidth: 'md', mx: 'auto' }}
                            >
                                Our core values guide everything we do at PetCare, from how we build our platform to how we interact with our community.
                            </Typography>
                        </Box>

                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: 'flex', mb: 3 }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: 'primary.main',
                                            width: 50,
                                            height: 50,
                                            mr: 2
                                        }}
                                    >
                                        <PetsIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" fontWeight="medium" gutterBottom>
                                            Pet Safety & Wellbeing
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            We prioritize the safety, health, and happiness of all pets in our care. Every decision we make puts pets first.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: 'flex', mb: 3 }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: 'primary.main',
                                            width: 50,
                                            height: 50,
                                            mr: 2
                                        }}
                                    >
                                        <MessageIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" fontWeight="medium" gutterBottom>
                                            Trust & Transparency
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            We believe in building trust through transparency. From our verification process to our review system, we ensure pet owners can make informed decisions.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: 'flex', mb: 3 }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: 'primary.main',
                                            width: 50,
                                            height: 50,
                                            mr: 2
                                        }}
                                    >
                                        <PublicIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" fontWeight="medium" gutterBottom>
                                            Community
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            We're building more than a service - we're creating a community of pet lovers who share knowledge, experiences, and a passion for animals.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: 'flex', mb: 3 }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: 'primary.main',
                                            width: 50,
                                            height: 50,
                                            mr: 2
                                        }}
                                    >
                                        <FlashOnIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" fontWeight="medium" gutterBottom>
                                            Innovation
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            We continuously improve our platform and services based on user feedback and emerging technologies to provide the best experience for pets and their owners.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* CTA */}
                <Container maxWidth="lg" sx={{ mb: 6 }}>
                    <Card
                        sx={{
                            bgcolor: 'white',
                            p: 4,
                            borderRadius: 2,
                            boxShadow: 2
                        }}
                    >
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item xs={12} md={8}>
                                <Typography variant="h4" component="h3" fontWeight="bold" gutterBottom>
                                    Ready to join our community?
                                </Typography>
                                <Typography variant="h5" color="primary.main" gutterBottom>
                                    Start using PetCare today.
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' }, mt: { xs: 2, md: 0 } }}>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                                    <Button
                                        component={Link}
                                        to={AppRoute.Register}
                                        variant="contained"
                                        size="large"
                                        color="primary"
                                    >
                                        Get started
                                    </Button>
                                    <Button
                                        component={Link}
                                        to="/"
                                        variant="outlined"
                                        size="large"
                                        color="primary"
                                    >
                                        Give feedback
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Card>
                </Container>
            </WebsiteLayout>
        </>
    );
};