import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Container
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PetsIcon from '@mui/icons-material/Pets';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppRoute } from '../../../routes';
import { FormattedMessage, useIntl } from 'react-intl';
import { UserRoleEnum } from '@infrastructure/apis/client';
import { useAppDispatch, useAppSelector } from '@application/store';
import { resetProfile } from '@application/state-slices';

/**
 * Navigation bar component
 */
export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const { loggedIn } = useAppSelector(state => state.profileReducer);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  // Update user state when authentication changes
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && loggedIn) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    } else {
      setUser(null);
    }
  }, [loggedIn, location]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(resetProfile());
    navigate(AppRoute.Login);
    setMobileOpen(false);
  };

  // Define navigation links based on user role
  const getNavLinks = () => {
    if (!user) {
      return [
        { name: formatMessage({ id: 'nav.home', defaultMessage: 'Home' }), path: AppRoute.Index },
        { name: formatMessage({ id: 'nav.about', defaultMessage: 'About' }), path: AppRoute.About },
        { name: formatMessage({ id: 'nav.login', defaultMessage: 'Login' }), path: AppRoute.Login },
        { name: formatMessage({ id: 'nav.register', defaultMessage: 'Register' }), path: AppRoute.Register }
      ];
    }

    if (user.role === UserRoleEnum.Client) {
      return [
        { name: formatMessage({ id: 'nav.dashboard', defaultMessage: 'Dashboard' }), path: AppRoute.ClientDashboard },
        { name: formatMessage({ id: 'nav.myPets', defaultMessage: 'My Pets' }), path: AppRoute.ClientPets },
        { name: formatMessage({ id: 'nav.myBookings', defaultMessage: 'My Bookings' }), path: AppRoute.ClientBookings },
        { name: formatMessage({ id: 'nav.findSitters', defaultMessage: 'Find Sitters' }), path: AppRoute.Sitters },
        { name: formatMessage({ id: 'nav.profile', defaultMessage: 'Profile' }), path: AppRoute.Profile }
      ];
    } else if (user.role === UserRoleEnum.Sitter) {
      return [
        { name: formatMessage({ id: 'nav.dashboard', defaultMessage: 'Dashboard' }), path: AppRoute.SitterDashboard },
        { name: formatMessage({ id: 'nav.myBookings', defaultMessage: 'My Bookings' }), path: AppRoute.SitterBookings },
        { name: formatMessage({ id: 'nav.myReviews', defaultMessage: 'My Reviews' }), path: AppRoute.SitterReviews },
        { name: formatMessage({ id: 'nav.profile', defaultMessage: 'Profile' }), path: AppRoute.Profile }
      ];
    }

    return [];
  };

  const navLinks = getNavLinks();

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {navLinks.map((link) => (
          <ListItem
            button
            key={link.name}
            component={Link}
            to={link.path}
            onClick={() => setMobileOpen(false)}
            selected={location.pathname === link.path}
          >
            <ListItemText primary={link.name} />
          </ListItem>
        ))}
      </List>
      <Divider />
      {user && (
        <List>
          <ListItem>
            <ListItemText
              primary={user.name}
              secondary={user.role}
            />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemText primary={formatMessage({ id: 'nav.logout', defaultMessage: 'Logout' })} />
          </ListItem>
        </List>
      )}
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Container>
          <Toolbar disableGutters>
            {/* Logo - visible on all screen sizes */}
            <PetsIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to={AppRoute.Index}
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              PetCare
            </Typography>

            {/* Mobile menu icon */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleDrawerToggle}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Mobile logo */}
            <PetsIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to={AppRoute.Index}
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              PetCare
            </Typography>

            {/* Desktop navigation links */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {navLinks.map((link) => (
                <Button
                  key={link.name}
                  component={Link}
                  to={link.path}
                  sx={{
                    my: 2,
                    color: 'white',
                    display: 'block',
                    backgroundColor: location.pathname === link.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                  }}
                >
                  {link.name}
                </Button>
              ))}
            </Box>

            {/* User menu and login/register buttons */}
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {user ? (
                <>
                  <Typography variant="body1" sx={{ my: 2, mr: 2 }}>
                    {user.name}
                  </Typography>
                  <Button
                    color="inherit"
                    onClick={handleLogout}
                  >
                    <FormattedMessage id="nav.logout" defaultMessage="Logout" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to={AppRoute.Login}
                  >
                    <FormattedMessage id="nav.login" defaultMessage="Login" />
                  </Button>
                  <Button
                    color="inherit"
                    component={Link}
                    to={AppRoute.Register}
                  >
                    <FormattedMessage id="nav.register" defaultMessage="Register" />
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};