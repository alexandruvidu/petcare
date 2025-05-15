import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, IconButton, Typography, Box, Drawer, List, ListItem, ListItemButton, ListItemText, useTheme, useMediaQuery, Divider, Avatar, Tooltip, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTokenHasExpired } from '@infrastructure/hooks/useOwnUser';
import { useAppDispatch } from '@application/store';
import { resetProfile } from '@application/state-slices';
import { AppRoute } from 'routes';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { UserRoleEnum } from '@infrastructure/apis/client';
import { NavbarLanguageSelector } from '@presentation/components/ui/NavbarLanguageSelector/NavbarLanguageSelector';
import PetsIcon from '@mui/icons-material/Pets';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const navBarMessages = defineMessages({
  home: { id: 'nav.home', defaultMessage: 'Home' },
  about: { id: 'nav.about', defaultMessage: 'About' },
  login: { id: 'nav.login', defaultMessage: 'Login' },
  register: { id: 'nav.register', defaultMessage: 'Register' },
  dashboard: { id: 'nav.dashboard', defaultMessage: 'Dashboard' },
  myPets: { id: 'nav.myPets', defaultMessage: 'My Pets' },
  myBookings: { id: 'nav.myBookings', defaultMessage: 'My Bookings' },
  findSitters: { id: 'nav.findSitters', defaultMessage: 'Find Sitters' },
  profile: { id: 'nav.profile', defaultMessage: 'Profile' },
  myReviews: { id: 'nav.myReviews', defaultMessage: 'My Reviews' },
  logout: { id: 'nav.logout', defaultMessage: 'Logout' },
  adminDashboard: { id: 'nav.adminDashboard', defaultMessage: 'Admin Dashboard' }, // General Admin Link
  adminUsers: { id: 'nav.adminUsers', defaultMessage: 'Manage Users' },
  adminPets: { id: 'nav.adminPets', defaultMessage: 'Manage Pets' },
  adminBookings: { id: 'nav.adminBookings', defaultMessage: 'Manage Bookings' },
  adminSitterProfiles: { id: 'nav.adminSitterProfiles', defaultMessage: 'Sitter Profiles' },
  adminReviews: { id: 'nav.adminReviews', defaultMessage: 'Manage Reviews' },
  roleClient: { id: 'globals.client', defaultMessage: 'Client' },
  roleSitter: { id: 'globals.sitter', defaultMessage: 'Sitter' },
  roleAdmin: { id: 'globals.admin', defaultMessage: 'Admin' },
});

type NavMessageKey = keyof typeof navBarMessages;

interface NavLink {
  messageKey: NavMessageKey;
  path: AppRoute;
  roles?: UserRoleEnum[];
  publicOnly?: boolean;
  authenticatedOnly?: boolean;
  isAdminSubLink?: boolean; // To group admin links under a dropdown
}

export const Navbar = () => {
  const { formatMessage } = useIntl();
  const [user, setUser] = useState<{ id: string, name: string; role: UserRoleEnum; } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminMenuAnchorEl, setAdminMenuAnchorEl] = useState<null | HTMLElement>(null);
  const isAdminMenuOpen = Boolean(adminMenuAnchorEl);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { loggedIn } = useTokenHasExpired();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleAdminMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAdminMenuAnchorEl(event.currentTarget);
  };
  const handleAdminMenuClose = () => {
    setAdminMenuAnchorEl(null);
  };
  const handleAdminSubLinkClick = (path: AppRoute) => {
    navigate(path);
    handleAdminMenuClose();
  }


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
    handleAdminMenuClose();
  }, [navigate, dispatch, isMobile]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const allNavLinks: NavLink[] = [
    { messageKey: 'home', path: AppRoute.Index, publicOnly: true },
    { messageKey: 'about', path: AppRoute.About, publicOnly: true },
    { messageKey: 'login', path: AppRoute.Login, publicOnly: true },
    { messageKey: 'register', path: AppRoute.Register, publicOnly: true },

    { messageKey: 'dashboard', path: AppRoute.ClientDashboard, roles: [UserRoleEnum.Client], authenticatedOnly: true },
    { messageKey: 'myPets', path: AppRoute.ClientPets, roles: [UserRoleEnum.Client], authenticatedOnly: true },
    { messageKey: 'myBookings', path: AppRoute.ClientBookings, roles: [UserRoleEnum.Client], authenticatedOnly: true },
    { messageKey: 'findSitters', path: AppRoute.Sitters, roles: [UserRoleEnum.Client], authenticatedOnly: true },

    { messageKey: 'dashboard', path: AppRoute.SitterDashboard, roles: [UserRoleEnum.Sitter], authenticatedOnly: true },
    { messageKey: 'myBookings', path: AppRoute.SitterBookings, roles: [UserRoleEnum.Sitter], authenticatedOnly: true },
    { messageKey: 'myReviews', path: AppRoute.SitterReviews, roles: [UserRoleEnum.Sitter], authenticatedOnly: true },

    // Admin Links
    { messageKey: 'adminUsers', path: AppRoute.AdminUsers, roles: [UserRoleEnum.Admin], authenticatedOnly: true, isAdminSubLink: true },
    { messageKey: 'adminPets', path: AppRoute.AdminPets, roles: [UserRoleEnum.Admin], authenticatedOnly: true, isAdminSubLink: true },
    { messageKey: 'adminBookings', path: AppRoute.AdminBookings, roles: [UserRoleEnum.Admin], authenticatedOnly: true, isAdminSubLink: true },
    { messageKey: 'adminSitterProfiles', path: AppRoute.AdminSitterProfiles, roles: [UserRoleEnum.Admin], authenticatedOnly: true, isAdminSubLink: true },
    { messageKey: 'adminReviews', path: AppRoute.AdminReviews, roles: [UserRoleEnum.Admin], authenticatedOnly: true, isAdminSubLink: true },
  ];

  const getFilteredNavLinks = (forDrawer: boolean = false) => {
    let linksToShow: NavLink[] = [];
    if (loggedIn && user) {
      linksToShow = allNavLinks.filter(link => {
        if (link.publicOnly) return false;
        if (link.isAdminSubLink && !forDrawer) return false; // Hide admin sub-links from main bar if not for drawer

        if (link.messageKey === 'dashboard') {
          return (user.role === UserRoleEnum.Client && link.path === AppRoute.ClientDashboard) ||
              (user.role === UserRoleEnum.Sitter && link.path === AppRoute.SitterDashboard);
        }
        if (link.messageKey === 'myBookings') {
          return (user.role === UserRoleEnum.Client && link.path === AppRoute.ClientBookings) ||
              (user.role === UserRoleEnum.Sitter && link.path === AppRoute.SitterBookings);
        }

        if (link.roles) {
          return link.roles.includes(user.role);
        }
        if (link.authenticatedOnly && !link.roles) return true;

        return false;
      });
    } else {
      linksToShow = allNavLinks.filter(link => link.publicOnly || (!link.authenticatedOnly && !link.roles && !link.isAdminSubLink));
    }
    return linksToShow;
  };


  const mainNavLinks = getFilteredNavLinks(false);
  const drawerNavLinks = getFilteredNavLinks(true);
  const adminSubLinks = allNavLinks.filter(link => link.isAdminSubLink);


  const getUserRoleMessageKey = (role: UserRoleEnum): NavMessageKey => {
    switch (role) {
      case UserRoleEnum.Client: return 'roleClient';
      case UserRoleEnum.Sitter: return 'roleSitter';
      case UserRoleEnum.Admin: return 'roleAdmin';
      default: return 'roleClient';
    }
  };

  const drawerContent = (
      <Box onClick={isMobile ? handleDrawerToggle : undefined} sx={{ textAlign: 'center', width: 250, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{my: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main' }}>
          <PetsIcon sx={{ mr: 1 }} />
          <Typography variant="h6" noWrap>PetCare</Typography>
        </Box>
        <Divider />
        <List sx={{flexGrow: 1}}>
          {drawerNavLinks.map((link) => (
              <ListItem key={`${link.messageKey}-${link.path}-drawer`} disablePadding>
                <ListItemButton component={RouterLink} to={link.path} selected={location.pathname === link.path}>
                  <ListItemText primary={<FormattedMessage {...navBarMessages[link.messageKey]} />} />
                </ListItemButton>
              </ListItem>
          ))}
          {loggedIn && user && (
              <>
                <Divider sx={{ my: 1 }}/>
                <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt:1 }}>
                  <Tooltip title={formatMessage(navBarMessages.profile)}>
                    <IconButton component={RouterLink} to={AppRoute.Profile} sx={{ p: 0, mb: 1 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main', width: 48, height: 48 }}>
                        {user.name?.[0]?.toUpperCase()}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <ListItemText
                      primary={user.name}
                      secondary={<FormattedMessage {...navBarMessages[getUserRoleMessageKey(user.role)]} />}
                      primaryTypographyProps={{fontWeight: 'medium'}}
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleLogout} sx={{justifyContent: 'center'}}>
                    <ListItemText primary={<FormattedMessage {...navBarMessages.logout} />} sx={{color: 'error.main', textAlign: 'center'}}/>
                  </ListItemButton>
                </ListItem>
              </>
          )}
        </List>
        <Box sx={{ p: 2, mt: 'auto'}}>
          <NavbarLanguageSelector />
        </Box>
      </Box>
  );

  return (
      <AppBar position="sticky" sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
        <Toolbar sx={{justifyContent: 'space-between'}}>
          <Box sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'primary.main' }} component={RouterLink}
               to={loggedIn && user ? (user.role === UserRoleEnum.Client ? AppRoute.ClientDashboard : user.role === UserRoleEnum.Sitter ? AppRoute.SitterDashboard : user.role === UserRoleEnum.Admin ? AppRoute.AdminUsers : AppRoute.Index ) : AppRoute.Index}>
            <PetsIcon sx={{ mr: 1, fontSize: '2rem' }} />
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              PetCare
            </Typography>
          </Box>

          {isMobile && (
              <IconButton color="inherit" aria-label="open drawer" edge="end" onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
          )}

          {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {mainNavLinks.map((link) => (
                    <Button
                        color={location.pathname === link.path ? "primary" : "inherit"}
                        variant={location.pathname === link.path ? "outlined" : "text"}
                        component={RouterLink}
                        to={link.path}
                        key={`${link.messageKey}-${link.path}-main`}
                        sx={{ my: 1, mx: 1 }}
                    >
                      <FormattedMessage {...navBarMessages[link.messageKey]} />
                    </Button>
                ))}
                {user?.role === UserRoleEnum.Admin && (
                    <>
                      <Button
                          id="admin-menu-button"
                          aria-controls={isAdminMenuOpen ? 'admin-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={isAdminMenuOpen ? 'true' : undefined}
                          onClick={handleAdminMenuOpen}
                          color={location.pathname.startsWith("/admin") ? "primary" : "inherit"}
                          variant={location.pathname.startsWith("/admin") ? "outlined" : "text"}
                          sx={{ my: 1, mx: 1 }}
                          startIcon={<AdminPanelSettingsIcon />}
                          endIcon={<ExpandMoreIcon />}
                      >
                        <FormattedMessage id="nav.adminDashboard" />
                      </Button>
                      <Menu
                          id="admin-menu"
                          anchorEl={adminMenuAnchorEl}
                          open={isAdminMenuOpen}
                          onClose={handleAdminMenuClose}
                          MenuListProps={{
                            'aria-labelledby': 'admin-menu-button',
                          }}
                      >
                        {adminSubLinks.map((link) => (
                            <MenuItem
                                key={link.path}
                                onClick={() => handleAdminSubLinkClick(link.path)}
                                selected={location.pathname === link.path}
                            >
                              <FormattedMessage {...navBarMessages[link.messageKey]} />
                            </MenuItem>
                        ))}
                      </Menu>
                    </>
                )}
                <Box sx={{ml: 1, mr: 1}}> <NavbarLanguageSelector /> </Box>
                {loggedIn && user && (
                    <>
                      <Tooltip title={formatMessage(navBarMessages.profile)}>
                        <IconButton component={RouterLink} to={AppRoute.Profile} sx={{ p: 0, ml: 1.5 }}>
                          <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}>
                            {user.name?.[0]?.toUpperCase()}
                          </Avatar>
                        </IconButton>
                      </Tooltip>
                      <Button color="primary" variant="text" onClick={handleLogout} sx={{ml:1.5}}>
                        <FormattedMessage {...navBarMessages.logout} />
                      </Button>
                    </>
                )}
              </Box>
          )}
        </Toolbar>
        {isMobile && (
            <Drawer anchor="right" variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} PaperProps={{sx: {width: 250}}}>
              {drawerContent}
            </Drawer>
        )}
      </AppBar>
  );
};