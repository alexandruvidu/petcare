import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, IconButton, Typography, Box, Drawer, List, ListItem, ListItemText, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTokenHasExpired } from '@infrastructure/hooks/useOwnUser';
import { useAppDispatch } from '@application/store';
import { resetProfile } from '@application/state-slices';
import { AppRoute } from 'routes';
import { FormattedMessage, useIntl } from 'react-intl';
import { UserRoleEnum } from '@infrastructure/apis/client';

/**
 * This is the navigation menu that will stay at the top of the page.
 */
export const Navbar = () => {
  const { formatMessage } = useIntl();
  const [user, setUser] = useState<{ name: string; role: string; } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { loggedIn } = useTokenHasExpired();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Effect to check for user login status
  useEffect(() => {
    const checkUserLoggedIn = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    // Check immediately
    checkUserLoggedIn();

    // Listen for storage events
    window.addEventListener('storage', checkUserLoggedIn);
    window.addEventListener('login', checkUserLoggedIn);

    // Also check every 2 seconds
    const interval = setInterval(checkUserLoggedIn, 2000);

    // Clean up
    return () => {
      window.removeEventListener('storage', checkUserLoggedIn);
      window.removeEventListener('login', checkUserLoggedIn);
      clearInterval(interval);
    };
  }, []);

  // Also listen to location changes to recheck user status
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    dispatch(resetProfile());
    navigate(AppRoute.Login);
    setMobileOpen(false);
  }, [navigate, dispatch]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const closeDrawer = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Define navlinks based on user role
  const getNavLinks = () => {
    if (!user) {
      return [
        { name: formatMessage({ id: 'nav.home' }), path: AppRoute.Index },
        { name: formatMessage({ id: 'nav.about' }), path: AppRoute.About },
        { name: formatMessage({ id: 'nav.login' }), path: AppRoute.Login },
        { name: formatMessage({ id: 'nav.register' }), path: AppRoute.Register }
      ];
    }

    if (user.role === UserRoleEnum.Client) {
      return [
        { name: formatMessage({ id: 'nav.dashboard' }), path: AppRoute.ClientDashboard },
        { name: formatMessage({ id: 'nav.myPets' }), path: AppRoute.ClientPets },
        { name: formatMessage({ id: 'nav.myBookings' }), path: AppRoute.ClientBookings },
        { name: formatMessage({ id: 'nav.findSitters' }), path: AppRoute.Sitters },
        { name: formatMessage({ id: 'nav.profile' }), path: AppRoute.Profile }
      ];
    } else if (user.role === UserRoleEnum.Sitter) {
      return [
        { name: formatMessage({ id: 'nav.dashboard' }), path: AppRoute.SitterDashboard },
        { name: formatMessage({ id: 'nav.myBookings' }), path: AppRoute.SitterBookings },
        { name: formatMessage({ id: 'nav.myReviews' }), path: AppRoute.SitterReviews },
        { name: formatMessage({ id: 'nav.profile' }), path: AppRoute.Profile }
      ];
    }

    return [];
  };

  const navLinks = getNavLinks();

  const drawer = (
      <Box onClick={closeDrawer} sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ my: 2 }}>
          PetCare
        </Typography>
        <List>
          {navLinks.map((link) => (
              <ListItem
                  component={Link}
                  to={link.path}
                  key={link.name}
                  sx={{
                    color: location.pathname === link.path ? 'primary.main' : 'text.primary',
                    fontWeight: location.pathname === link.path ? 'bold' : 'normal',
                    textDecoration: 'none',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    }
                  }}
              >
                <ListItemText primary={link.name} />
              </ListItem>
          ))}
          {user && (
              <ListItem button onClick={handleLogout}>
                <ListItemText primary={formatMessage({ id: 'nav.logout' })} />
              </ListItem>
          )}
        </List>
      </Box>
  );

  return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
          <Toolbar>
            {isMobile && (
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
            )}

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                PetCare
              </Link>
            </Typography>

            {!isMobile && (
                <Box sx={{ display: 'flex' }}>
                  {navLinks.map((link) => (
                      <Button
                          color="inherit"
                          component={Link}
                          to={link.path}
                          key={link.name}
                          sx={{
                            backgroundColor: location.pathname === link.path ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            }
                          }}
                      >
                        {link.name}
                      </Button>
                  ))}

                  {user && (
                      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                        <Typography variant="body2" sx={{ mr: 2 }}>
                          {user.name}
                        </Typography>
                        <Button color="inherit" onClick={handleLogout}>
                          {formatMessage({ id: 'nav.logout' })}
                        </Button>
                      </Box>
                  )}
                </Box>
            )}
          </Toolbar>
        </AppBar>

        <Box component="nav">
          <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                display: { xs: 'block', sm: 'block', md: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
              }}
          >
            {drawer}
          </Drawer>
        </Box>
      </Box>
  );
};