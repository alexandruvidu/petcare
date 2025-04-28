import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Box, 
  Paper,
  Divider
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { AppRoute } from '../../../routes';
import { useAppSelector } from '@application/store';
import { useGetMyPets, useGetMyBookings } from '@infrastructure/apis/api-management';
import PetsIcon from '@mui/icons-material/Pets';
import EventIcon from '@mui/icons-material/Event';
import HistoryIcon from '@mui/icons-material/History';

export const ClientDashboardPage = () => {
  const { user } = useAppSelector(state => state.profileReducer);
  const { data: pets } = useGetMyPets();
  const { data: bookings } = useGetMyBookings();
  
  const [stats, setStats] = useState({
    petCount: 0,
    activeBookings: 0,
    completedBookings: 0
  });

  useEffect(() => {
    if (pets) {
      setStats(prev => ({ ...prev, petCount: pets.length || 0 }));
    }
    
    if (bookings) {
      const active = bookings.filter(b => 
        b.status === 'Pending' || b.status === 'Accepted'
      ).length;
      
      const completed = bookings.filter(b => 
        b.status === 'Completed'
      ).length;
      
      setStats(prev => ({ 
        ...prev, 
        activeBookings: active,
        completedBookings: completed
      }));
    }
  }, [pets, bookings]);

  return (
    <>
      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 2, bgcolor: 'primary.light' }}>
        <Typography component="h1" variant="h4" gutterBottom>
          <FormattedMessage 
            id="pages.dashboard.welcome" 
            defaultMessage="Welcome, {name}"
            values={{ name: user?.name || 'Client' }}
          />
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <FormattedMessage id="pages.dashboard.clientSubtitle" defaultMessage="Manage your pets and bookings from your dashboard" />
        </Typography>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2">
                  My Pets
                </Typography>
                <PetsIcon fontSize="large" color="primary" />
              </Box>
              <Typography variant="h3" component="p" color="primary.main" fontWeight="bold">
                {stats.petCount}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button 
                  component={Link} 
                  to={AppRoute.ClientPets}
                  color="primary"
                >
                  Manage Pets →
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2">
                  Active Bookings
                </Typography>
                <EventIcon fontSize="large" color="success" />
              </Box>
              <Typography variant="h3" component="p" color="success.main" fontWeight="bold">
                {stats.activeBookings}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button 
                  component={Link} 
                  to={AppRoute.ClientBookings}
                  color="primary"
                >
                  View Bookings →
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2">
                  Completed Bookings
                </Typography>
                <HistoryIcon fontSize="large" color="text.secondary" />
              </Box>
              <Typography variant="h3" component="p" color="text.secondary" fontWeight="bold">
                {stats.completedBookings}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button 
                  component={Link} 
                  to={AppRoute.ClientBookings}
                  color="primary"
                >
                  View History →
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Button 
            component={Link}
            to={`${AppRoute.ClientPets}?action=add`}
            variant="outlined"
            color="primary"
            fullWidth
            sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <PetsIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Add a New Pet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Register your pet's information
            </Typography>
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Button 
            component={Link}
            to={`${AppRoute.ClientBookings}?action=add`}
            variant="outlined"
            color="success"
            fullWidth
            sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <EventIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Book a Pet Sitter
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Schedule a new booking
            </Typography>
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Button 
            component={Link}
            to={AppRoute.Sitters}
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <PetsIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Find Pet Sitters
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Browse available sitters
            </Typography>
          </Button>
        </Grid>
      </Grid>

      {/* Feedback Card */}
      <Paper sx={{ p: 4, bgcolor: 'primary.light', borderRadius: 2 }}>
        <Typography variant="h6" component="h3" color="primary.dark" gutterBottom>
          We Value Your Feedback
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Help us improve your experience by sharing your thoughts.
        </Typography>
        <Button variant="contained" color="primary">
          Give Feedback
        </Button>
      </Paper>
    </>
  );
};