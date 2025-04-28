import { Box, Container, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { AppRoute } from '../../../routes';
import { FormattedMessage } from 'react-intl';

/**
 * Footer component for the application
 */
export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ py: 3, bgcolor: 'primary.main', color: 'white', mt: 'auto' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2">
            © {currentYear} PetCare. <FormattedMessage id="footer.rights" defaultMessage="All rights reserved." />
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, md: 0 } }}>
            <MuiLink component={Link} to={AppRoute.Index} color="inherit">
              <FormattedMessage id="nav.home" defaultMessage="Home" />
            </MuiLink>
            <MuiLink component={Link} to={AppRoute.About} color="inherit">
              <FormattedMessage id="nav.about" defaultMessage="About" />
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
