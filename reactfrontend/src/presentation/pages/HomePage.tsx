import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Paper
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { AppRoute } from '../../routes';
import PetsIcon from '@mui/icons-material/Pets';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';

export const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
          color: 'white',
          mb: 4,
          pt: 8,
          pb: 6,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.6)',
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative', py: 6 }}>
          <Typography component="h1" variant="h2" align="center" gutterBottom>
            <FormattedMessage id="pages.about.title" defaultMessage="About PetCare" />
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            <FormattedMessage id="pages.about.mission" defaultMessage="Our mission is to make pet care easy, accessible, and worry-free for all pet owners." />
          </Typography>
        </Container>
      </Paper>

      {/* Our Story */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography component="h2" variant="h4" color="primary" gutterBottom>
              Our Story
            </Typography>
            <Typography paragraph>
              PetCare was founded in 2023 by a group of passionate pet owners who recognized the challenges of finding reliable pet care. We understood the anxiety that comes with leaving your beloved pets in someone else's hands.
            </Typography>
            <Typography paragraph>
              What started as a small community of pet lovers has grown into a comprehensive platform connecting thousands of pet owners with trusted pet sitters across the country.
            </Typography>
            <Typography paragraph>
              Our team consists of veterinarians, animal behaviorists, and technology experts all working together to create the best experience for pets and their owners.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <img 
              src="https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
              alt="Team with pets"
              style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }} 
            />
          </Grid>
        </Grid>
      </Container>

      <Divider sx={{ my: 6 }} />

      {/* Our Values */}
      <Box sx={{ bgcolor: 'primary.light', py: 6 }}>
        <Container maxWidth="lg">
          <Typography component="h2" variant="h4" align="center" color="primary.dark" gutterBottom>
            What We Believe In
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
            Our core values guide everything we do at PetCare, from how we build our platform to how we interact with our community.
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem alignItems="flex-start">
                  <ListItemIcon>
                    <PetsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Pet Safety & Wellbeing"
                    secondary="We prioritize the safety, health, and happiness of all pets in our care. Every decision we make puts pets first."
                  />
                </ListItem>
                <ListItem alignItems="flex-start">
                  <ListItemIcon>
                    <SecurityIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Trust & Transparency"
                    secondary="We believe in building trust through transparency. From our verification process to our review system, we ensure pet owners can make informed decisions."
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem alignItems="flex-start">
                  <ListItemIcon>
                    <GroupIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Community"
                    secondary="We're building more than a service - we're creating a community of pet lovers who share knowledge, experiences, and a passion for animals."
                  />
                </ListItem>
                <ListItem alignItems="flex-start">
                  <ListItemIcon>
                    <SpeedIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Innovation"
                    secondary="We continuously improve our platform and services based on user feedback and emerging technologies to provide the best experience for pets and their owners."
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography component="h2" variant="h4" color="text.primary" gutterBottom>
              Ready to join our community?
            </Typography>
            <Typography variant="h6" color="primary">
              Start using PetCare today.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mt: { xs: 4, md: 0 } }}>
            <Button 
              variant="contained" 
              color="primary"
              component={Link}
              to={AppRoute.Register}
            >
              Get started
            </Button>
            <Button 
              variant="outlined" 
              color="primary"
              component={Link}
              to={AppRoute.Login}
            >
              Sign in
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};