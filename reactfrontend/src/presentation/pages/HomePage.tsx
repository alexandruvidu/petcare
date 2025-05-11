import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';
import { WebsiteLayout } from '@presentation/layouts/WebsiteLayout';
import { useIntl } from 'react-intl';
import { AppRoute } from 'routes';
import PetsIcon from '@mui/icons-material/Pets';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { Seo } from '@presentation/components/ui/Seo';

export const HomePage = () => {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
      <>
        <Seo title="PetCare | Home" />
        <WebsiteLayout>
          {/* Hero Section */}
          <Box
              sx={{
                position: 'relative',
                height: { xs: '60vh', md: '70vh' },
                display: 'flex',
                alignItems: 'center',
                color: 'white',
                mb: 8,
                overflowX: 'hidden',
                borderRadius: 2,
                boxShadow: 3
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
                    backgroundColor: 'rgba(0, 50, 150, 0.7)',
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
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                  alt="Dog and person playing"
              />
            </Box>

            <Container>
              <Grid container spacing={4}>
                <Grid item xs={12} md={8} lg={6}>
                  <Typography
                      component="h1"
                      variant={isMobile ? "h3" : "h2"}
                      color="inherit"
                      gutterBottom
                      fontWeight="bold"
                  >
                    Caring for your pets when you can't
                  </Typography>
                  <Typography
                      variant="h6"
                      color="inherit"
                      paragraph
                      sx={{ mb: 4, opacity: 0.9 }}
                  >
                    PetCare connects pet owners with trusted pet sitters in your area.
                    Whether it's a day, a weekend, or longer - your pets will receive the care they deserve.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                        component={Link}
                        to={AppRoute.Register}
                        variant="contained"
                        size="large"
                        sx={{
                          bgcolor: 'white',
                          color: 'primary.main',
                          '&:hover': {
                            bgcolor: 'grey.100'
                          }
                        }}
                    >
                      Get Started
                    </Button>
                    <Button
                        component={Link}
                        to={AppRoute.About}
                        variant="outlined"
                        size="large"
                        sx={{
                          color: 'white',
                          borderColor: 'white',
                          '&:hover': {
                            borderColor: 'white',
                            bgcolor: 'rgba(255, 255, 255, 0.1)'
                          }
                        }}
                    >
                      Learn More
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Container>
          </Box>

          {/* Features Section */}
          <Box sx={{ py: 8, bgcolor: 'grey.50', borderRadius: 2, mb: 8 }}>
            <Container>
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography
                    component="span"
                    variant="overline"
                    color="primary.main"
                    fontWeight="bold"
                >
                  Our Services
                </Typography>
                <Typography
                    component="h2"
                    variant="h3"
                    fontWeight="bold"
                    sx={{ mt: 1, mb: 2 }}
                >
                  Everything your pet needs
                </Typography>
                <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ maxWidth: 'md', mx: 'auto' }}
                >
                  From walks and feeding to overnight stays, our sitters provide the best care for your furry friends.
                </Typography>
              </Box>

              <Grid container spacing={4}>
                {/* Feature 1 */}
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        boxShadow: 2,
                        border: '1px solid',
                        borderColor: 'grey.200'
                      }}
                  >
                    <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          pt: 3
                        }}
                    >
                      <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'primary.main',
                            color: 'white',
                            width: 60,
                            height: 60,
                            borderRadius: 2,
                            boxShadow: 2
                          }}
                      >
                        <PetsIcon fontSize="large" />
                      </Box>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, pt: 4 }}>
                      <Typography gutterBottom variant="h5" component="h3" textAlign="center">
                        Pet Sitting
                      </Typography>
                      <Typography>
                        Our pet sitters can visit your home to feed, play with, and care for your pets while you're away.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Feature 2 */}
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        boxShadow: 2,
                        border: '1px solid',
                        borderColor: 'grey.200'
                      }}
                  >
                    <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          pt: 3
                        }}
                    >
                      <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'primary.main',
                            color: 'white',
                            width: 60,
                            height: 60,
                            borderRadius: 2,
                            boxShadow: 2
                          }}
                      >
                        <HomeIcon fontSize="large" />
                      </Box>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, pt: 4 }}>
                      <Typography gutterBottom variant="h5" component="h3" textAlign="center">
                        Boarding
                      </Typography>
                      <Typography>
                        Your pet can stay at a sitter's home, receiving 24/7 attention and care in a safe environment.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Feature 3 */}
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        boxShadow: 2,
                        border: '1px solid',
                        borderColor: 'grey.200'
                      }}
                  >
                    <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          pt: 3
                        }}
                    >
                      <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'primary.main',
                            color: 'white',
                            width: 60,
                            height: 60,
                            borderRadius: 2,
                            boxShadow: 2
                          }}
                      >
                        <DirectionsRunIcon fontSize="large" />
                      </Box>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, pt: 4 }}>
                      <Typography gutterBottom variant="h5" component="h3" textAlign="center">
                        Dog Walking
                      </Typography>
                      <Typography>
                        Regular walks keep your dog happy and healthy, providing exercise and mental stimulation.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Container>
          </Box>

          {/* CTA Section */}
          <Box
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                py: 8,
                borderRadius: 2,
                mb: 6,
                boxShadow: 3
              }}
          >
            <Container maxWidth="lg">
              <Grid container justifyContent="center" textAlign="center">
                <Grid item xs={12} md={8}>
                  <Typography
                      variant={isMobile ? "h4" : "h3"}
                      component="h2"
                      fontWeight="bold"
                      gutterBottom
                  >
                    Ready to find the perfect pet sitter?
                  </Typography>
                  <Typography
                      variant="h6"
                      sx={{
                        mb: 4,
                        opacity: 0.9,
                        maxWidth: 'md',
                        mx: 'auto'
                      }}
                  >
                    Join thousands of satisfied pet owners who trust PetCare with their furry, feathered, and scaly friends.
                  </Typography>
                  <Button
                      component={Link}
                      to={AppRoute.Register}
                      variant="contained"
                      size="large"
                      sx={{
                        bgcolor: 'white',
                        color: 'primary.main',
                        px: 4,
                        '&:hover': {
                          bgcolor: 'grey.100'
                        }
                      }}
                  >
                    Sign up for free
                  </Button>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </WebsiteLayout>
      </>
  );
};