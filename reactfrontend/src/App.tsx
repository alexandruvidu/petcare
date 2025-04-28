import { UserRoleEnum } from '@infrastructure/apis/client';
import { useOwnUserHasRole } from '@infrastructure/hooks/useOwnUser';
import { AppIntlProvider } from '@presentation/components/ui/AppIntlProvider';
import { ToastNotifier } from '@presentation/components/ui/ToastNotifier';
import { Route, Routes } from 'react-router-dom';
import { AppRoute } from './routes';

// Layout
import { WebsiteLayout } from '@presentation/layouts/WebsiteLayout';

// Pages
import { HomePage } from '@presentation/pages/HomePage';
import { AboutPage } from '@presentation/pages/AboutPage';
import { LoginPage } from '@presentation/pages/LoginPage';
import { RegisterPage } from '@presentation/pages/RegisterPage';
import { PublicSitterReviewsPage } from '@presentation/pages/sitter/PublicSitterReviewsPage';

// Client Pages
import { ClientDashboardPage } from '@presentation/pages/client/DashboardPage';
import { PetsTablePage } from '@presentation/pages/client/PetsTablePage';
import { ClientBookingsTablePage } from '@presentation/pages/client/BookingsTablePage';
import { SittersListPage } from '@presentation/pages/client/SittersListPage';

// Sitter Pages
import { SitterDashboardPage } from '@presentation/pages/sitter/DashboardPage';
import { SitterBookingsViewPage } from '@presentation/pages/sitter/SitterBookingsViewPage';
import { SitterReviewsPage } from '@presentation/pages/sitter/SitterReviewsPage';
import { SitterProfilePage } from '@presentation/pages/sitter/SitterProfilePage';

// Common Pages
import { ProfilePage } from '@presentation/pages/profile/ProfilePage';
import { ProtectedRouteComponent } from '@presentation/components/auth/ProtectedRoute';

export function App() {
  const isClient = useOwnUserHasRole(UserRoleEnum.Client);
  const isSitter = useOwnUserHasRole(UserRoleEnum.Sitter);

  return (
    <AppIntlProvider>
      <ToastNotifier />
      <WebsiteLayout>
        <Routes>
          {/* Public Routes */}
          <Route path={AppRoute.Index} element={<HomePage />} />
          <Route path={AppRoute.About} element={<AboutPage />} />
          <Route path={AppRoute.Login} element={<LoginPage />} />
          <Route path={AppRoute.Register} element={<RegisterPage />} />
          <Route path={AppRoute.PublicSitterReviews} element={<PublicSitterReviewsPage />} />
          
          {/* Client Routes */}
          <Route 
            path={AppRoute.ClientDashboard} 
            element={
              <ProtectedRouteComponent allowedRoles={[UserRoleEnum.Client]}>
                <ClientDashboardPage />
              </ProtectedRouteComponent>
            } 
          />
          <Route 
            path={AppRoute.ClientPets} 
            element={
              <ProtectedRouteComponent allowedRoles={[UserRoleEnum.Client]}>
                <PetsTablePage />
              </ProtectedRouteComponent>
            } 
          />
          <Route 
            path={AppRoute.ClientBookings} 
            element={
              <ProtectedRouteComponent allowedRoles={[UserRoleEnum.Client]}>
                <ClientBookingsTablePage />
              </ProtectedRouteComponent>
            } 
          />
          <Route 
            path={AppRoute.Sitters} 
            element={
              <ProtectedRouteComponent allowedRoles={[UserRoleEnum.Client]}>
                <SittersListPage />
              </ProtectedRouteComponent>
            } 
          />
          
          {/* Sitter Routes */}
          <Route 
            path={AppRoute.SitterDashboard} 
            element={
              <ProtectedRouteComponent allowedRoles={[UserRoleEnum.Sitter]}>
                <SitterDashboardPage />
              </ProtectedRouteComponent>
            } 
          />
          <Route 
            path={AppRoute.SitterBookings} 
            element={
              <ProtectedRouteComponent allowedRoles={[UserRoleEnum.Sitter]}>
                <SitterBookingsViewPage />
              </ProtectedRouteComponent>
            } 
          />
          <Route 
            path={AppRoute.SitterReviews} 
            element={
              <ProtectedRouteComponent allowedRoles={[UserRoleEnum.Sitter]}>
                <SitterReviewsPage />
              </ProtectedRouteComponent>
            } 
          />
          
          {/* Common Routes */}
          <Route 
            path={AppRoute.Profile} 
            element={
              <ProtectedRouteComponent allowedRoles={[UserRoleEnum.Client, UserRoleEnum.Sitter]}>
                {isSitter ? <SitterProfilePage /> : <ProfilePage />}
              </ProtectedRouteComponent>
            } 
          />
          
          {/* Redirect from old sitter profile to new profile */}
          <Route 
            path={AppRoute.SitterProfile} 
            element={
              <ProtectedRouteComponent allowedRoles={[UserRoleEnum.Sitter]}>
                <SitterProfilePage />
              </ProtectedRouteComponent>
            } 
          />
          
          {/* Redirect to home for any unmatched routes */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </WebsiteLayout>
    </AppIntlProvider>
  );
}

export default App;