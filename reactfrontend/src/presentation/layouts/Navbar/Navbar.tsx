import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, IconButton, Typography, Box, Drawer, List, ListItem, ListItemButton, ListItemText, useTheme, useMediaQuery, Divider, Avatar } from '@mui/material'; // Added ListItemButton
import MenuIcon from '@mui/icons-material/Menu';
import { useTokenHasExpired } from '@infrastructure/hooks/useOwnUser';
import { useAppDispatch } from '@application/store';
import { resetProfile } from '@application/state-slices';
import { AppRoute } from 'routes';
import { FormattedMessage, useIntl } from 'react-intl';
import { UserRoleEnum } from '@infrastructure/apis/client';
import { NavbarLanguageSelector } from '@presentation/components/ui/NavbarLanguageSelector/NavbarLanguageSelector';

interface NavLink {
  name: string;
  path: AppRoute;
  roles?: UserRoleEnum[];
  publicOnly?: boolean; // Renamed from public to avoid conflict, true if only visible when not logged in
  authenticatedOnly?: boolean; // Renamed from authenticated
  hideWhenLoggedIn?: boolean; // Explicitly for Login/Register
}

export const Navbar = () => {
  const { formatMessage } = useIntl();
  const [user, setUser] = useState<{ id: string, name: string; role: UserRoleEnum; } | null>(null); // Added id
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { loggedIn } = useTokenHasExpired();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const updateUserData = useCallback(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({ id: parsedUser.id, name: parsedUser.name, role: parsedUser.role as UserRoleEnum });
      } catch (e) { setUser(null); }
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    updateUserData();
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'user' || event.key === 'token') updateUserData();
    };
    const handleLoginEvent = () => updateUserData();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('login', handleLoginEvent);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('login', handleLoginEvent);
    };
  }, [updateUserData]);

  useEffect(() => { updateUserData(); }, [location, updateUserData]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(resetProfile());
    setUser(null);
    navigate(AppRoute.Login);
    if (isMobile) setMobileOpen(false);
  }, [navigate, dispatch, isMobile]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const allNavLinks: NavLink[] = [
    { name: formatMessage({ id: 'nav.home' }), path: AppRoute.Index, publicOnly: false, authenticatedOnly: false }, // Visible to all
    { name: formatMessage({ id: 'nav.about' }), path: AppRoute.About, publicOnly: false, authenticatedOnly: false }, // Visible to all
    { name: formatMessage({ id: 'nav.login' }), path: AppRoute.Login, publicOnly: true, hideWhenLoggedIn: true },
    { name: formatMessage({ id: 'nav.register' }), path: AppRoute.Register, publicOnly: true, hideWhenLoggedIn: true },
    { name: formatMessage({ id: 'nav.dashboard' }), path: AppRoute.ClientDashboard, roles: [UserRoleEnum.Client], authenticatedOnly: true },
    { name: formatMessage({ id: 'nav.myPets' }), path: AppRoute.ClientPets, roles: [UserRoleEnum.Client], authenticatedOnly: true },
    { name: formatMessage({ id: 'nav.myBookings' }), path: AppRoute.ClientBookings, roles: [UserRoleEnum.Client], authenticatedOnly: true },
    { name: formatMessage({ id: 'nav.findSitters' }), path: AppRoute.Sitters, roles: [UserRoleEnum.Client], authenticatedOnly: true },
    { name: formatMessage({ id: 'nav.dashboard' }), path: AppRoute.SitterDashboard, roles: [UserRoleEnum.Sitter], authenticatedOnly: true },
    { name: formatMessage({ id: 'nav.myBookings' }), path: AppRoute.SitterBookings, roles: [UserRoleEnum.Sitter], authenticatedOnly: true },
    { name: formatMessage({ id: 'nav.myReviews' }), path: AppRoute.SitterReviews, roles: [UserRoleEnum.Sitter], authenticatedOnly: true },
    { name: formatMessage({ id: 'nav.profile' }), path: AppRoute.Profile, authenticatedOnly: true },
  ];

  const getFilteredNavLinks = () => {
    if (loggedIn && user) {
      return allNavLinks.filter(link => {
        if (link.hideWhenLoggedIn) return false;
        if (link.authenticatedOnly || (link.roles && link.roles.includes(user.role))) return true;
        return !link.publicOnly && !link.authenticatedOnly && !link.roles; // For truly public links like Home, About when logged in
      });
    }
    return allNavLinks.filter(link => !link.authenticatedOnly && !link.roles && !link.hideWhenLoggedIn); // Public not-logged-in links
  };

  const navLinksToDisplay = getFilteredNavLinks();

  const drawerContent = (
      <Box onClick={isMobile ? handleDrawerToggle : undefined} sx={{ textAlign: 'center', width: 250 }}>
        <Typography variant="h6" sx={{ my: 2, color: 'primary.main' }}>PetCare</Typography>
        <Divider />
        <List>
          {navLinksToDisplay.map((link) => (
              <ListItem key={`${link.name}-${link.path}`} disablePadding>
                <ListItemButton component={RouterLink} to={link.path} selected={location.pathname === link.path}>
                  <ListItemText primary={link.name} />
                </ListItemButton>
              </ListItem>
          ))}
          {loggedIn && user && (
              <>
                <Divider sx={{ my: 1 }}/>
                <ListItem>
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 1 }}>{user.name?.[0]?.toUpperCase()}</Avatar>
                  <ListItemText primary={user.name} secondary={user.role} />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleLogout}>
                    <ListItemText primary={formatMessage({ id: 'nav.logout' })} sx={{color: 'error.main'}}/>
                  </ListItemButton>
                </ListItem>
              </>
          )}
        </List>
        <Box sx={{ p: 2, position: 'absolute', bottom: 0, width: '100%'}}>
          <NavbarLanguageSelector />
        </Box>
      </Box>
  );

  return (
      <AppBar position="sticky" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          {isMobile && (
              <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
          )}
          <Typography variant="h6" component={RouterLink} to={AppRoute.Index} sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
            PetCare
          </Typography>
          {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {navLinksToDisplay.map((link) => (
                    <Button color="inherit" component={RouterLink} to={link.path} key={`${link.name}-${link.path}`}
                            sx={{ my: 1, mx: 1.5, backgroundColor: location.pathname === link.path ? 'rgba(255,255,255,0.2)' : 'transparent', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)'} }}>
                      {link.name}
                    </Button>
                ))}
                <Box sx={{ml: 1, mr: 2}}> <NavbarLanguageSelector /> </Box>
                {loggedIn && user && (
                    <>
                      <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, ml:1, mr: 1 }}>{user.name?.[0]?.toUpperCase()}</Avatar>
                      <Typography sx={{ mr: 2, color: 'white' }}>{user.name}</Typography>
                      <Button color="inherit" variant="outlined" onClick={handleLogout} sx={{borderColor: 'rgba(255,255,255,0.5)', '&:hover': {borderColor: 'white'}}}>
                        <FormattedMessage id="nav.logout" />
                      </Button>
                    </>
                )}
              </Box>
          )}
        </Toolbar>
        {isMobile && (
            <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }}>
              {drawerContent}
            </Drawer>
        )}
      </AppBar>
  );
};