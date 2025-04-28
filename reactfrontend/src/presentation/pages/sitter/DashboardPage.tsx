import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Box, 
  Paper,
  Divider,
  Alert,
  AlertTitle
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';
import { AppRoute } from '../../../routes';
import { useAppSelector } from '@application/store';
import { useGetMyBookings, useGetMyProfile, useGetSitterReviews } from '@infrastructure/apis/api-management';
import EventIcon from '@mui/icons-material/Event';
import UpcomingIcon from '@mui/icons-material/Upcoming';
import HistoryIcon from '@mui/icons-material/History';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import ListIcon from '@mui/icons-material/List';
import GradeIcon from '@mui/icons-material/Grade';

export const SitterDashboardPage = () => {
  const { user } = useAppSelector(state => state.profileReducer);
  const { data: bookings } = useGetMyBookings();
  const { data: profile } = useGetMyProfile();
  const { data: reviews } = useGetSitterReviews(user?.id);
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    activeBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
    avgRating: 0,
    reviewCount: 0
  });

  useEffect(() => {
    if (bookings) {
      const today = new Date();
      
      const active = bookings.filter(b => 
        (b.status === 'Accepted' || b.status === 'Pending') && 
        new Date(b.endDate) >= today
      ).length;
      
      const completed = bookings.filter(b => 
        b.status === 'Completed'
      ).length;
      
      const upcoming = bookings.filter(b => 
        b.status === 'Accepted' && 
        new Date(b.startDate) > today
      ).length;
      
      setStats(prev => ({ 
        ...prev, 
        activeBookings: active,
        completedBookings: completed,
        upcomingBookings: upcoming
      }));
    }
    
    if (reviews && reviews.length > 0) {
      const total = reviews.reduce((sum, review) => sum + review.rating, 0);
      const avg = (total / reviews.length).toFixed(1);
      
      setStats(prev => ({
        ...prev,
        avgRating: avg,
        reviewCount: reviews.length
      }));
    }
  }, [bookings, reviews]);

  const goToProfileTab = () => {
    navigate(AppRoute.Profile);
  };

  return (
    <>
      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 2, bgcolor: 'primary.light' }}>
        <Typography component="h1" variant="h4" gutterBottom>
          <FormattedMessage 
            id="pages.dashboard.welcome" 
            defaultMessage="Welcome, {name}"
            values={{ name: user?.name || 'Sitter' }}
          />
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <FormattedMessage id="pages.dashboard.sitterSubtitle" defaultMessage="Manage your pet sitting bookings from your dashboard" />
        </Typography>
      </Paper>

      {!profile && (
        <Alert severity="warning" sx={{ mb: 4 }}>
          <AlertTitle>Complete Your Profile</AlertTitle>
          Pet owners can't see your profile until you complete your information. Add your bio, experience, and rates to get started.
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="outlined" 
              color="warning"
              onClick={goToProfileTab}
            >
              Complete Profile
            </Button>
          </Box>
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2">
                  Active Bookings
                </Typography>
                <EventIcon fontSize="large" color="primary" />
              </Box>
              <Typography variant="h3" component="p" color="primary.main" fontWeight="bold">
                {stats.activeBookings}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button 
                  component={Link} 
                  to={AppRoute.SitterBookings}
                  color="primary"
                >
                  View Bookings →
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2">
                  Upcoming
                </Typography>
                <UpcomingIcon fontSize="large" color="success" />
              </Box>
              <Typography variant="h3" component="p" color="success.main" fontWeight="bold">
                {stats.upcomingBookings}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button 
                  component={Link} 
                  to={AppRoute.SitterBookings}
                  color="primary"
                >
                  View Schedule →
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2">
                  Completed
                </Typography>
                <HistoryIcon fontSize="large" color="text.secondary" />
              </Box>
              <Typography variant="h3" component="p" color="text.secondary" fontWeight="bold">
                {stats.completedBookings}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button 
                  component={Link} 
                  to={AppRoute.SitterBookings}
                  color="primary"
                >
                  View History →
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2">
                  Rating
                </Typography>
                <StarIcon fontSize="large" color="warning" />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                <Typography variant="h3" component="p" color="warning.main" fontWeight="bold">
                  {stats.avgRating}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({stats.reviewCount} reviews)
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Button 
                  component={Link} 
                  to={AppRoute.SitterReviews}
                  color="primary"
                >
                  View Reviews →
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
            to={AppRoute.SitterBookings}
            variant="outlined"
            color="primary"
            fullWidth
            sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <ListIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Manage Bookings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Accept or reject booking requests
            </Typography>
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Button 
            onClick={goToProfileTab}
            variant="outlined"
            color="success"
            fullWidth
            sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <PersonIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Update Profile
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Edit your bio and availability
            </Typography>
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Button 
            component={Link}
            to={AppRoute.SitterReviews}
            variant="outlined"
            color="warning"
            fullWidth
            sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <GradeIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              View Reviews
            </Typography>
            <Typography variant="body2" color="text.secondary">
              See feedback from pet owners
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
}; 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.5)',
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative', py: 6 }}>
          <Typography component="h1" variant="h2" align="center" gutterBottom>
            <FormattedMessage id="pages.home.welcome" defaultMessage="Caring for your pets when you can't" />
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            <FormattedMessage id="pages.home.subtitle" defaultMessage="PetCare connects pet owners with trusted pet sitters in your area. Whether it's a day, a weekend, or longer - your pets will receive the care they deserve." />
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              component={Link}
              to={AppRoute.Register}
            >
              <FormattedMessage id="pages.home.getStarted" defaultMessage="Get Started" />
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              component={Link}
              to={AppRoute.About}
              sx={{ color: 'white', borderColor: 'white' }}
            >
              <FormattedMessage id="nav.about" defaultMessage="About" />
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography component="h2" variant="h3" align="center" color="primary" gutterBottom>
          Our Services
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          From walks and feeding to overnight stays, our sitters provide the best care for your furry friends.
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {/* Feature 1 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="div"
                sx={{
                  pt: '56.25%',
                  bgcolor: 'primary.light',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <PetsIcon sx={{ fontSize: 80, color: 'white', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
              </CardMedia>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
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
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="div"
                sx={{
                  pt: '56.25%',
                  bgcolor: 'secondary.light',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <HomeIcon sx={{ fontSize: 80, color: 'white', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
              </CardMedia>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
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
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="div"
                sx={{
                  pt: '56.25%',
                  bgcolor: 'success.light',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <AssignmentIcon sx={{ fontSize: 80, color: 'white', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
              </CardMedia>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
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

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6, mt: 8 }}>
        <Container maxWidth="md">
          <Typography component="h2" variant="h4" align="center" gutterBottom>
            Ready to find the perfect pet sitter?
          </Typography>
          <Typography variant="h6" align="center" paragraph>
            Join thousands of satisfied pet owners who trust PetCare with their furry, feathered, and scaly friends.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              component={Link}
              to={AppRoute.Register}
            >
              Sign up for free
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};