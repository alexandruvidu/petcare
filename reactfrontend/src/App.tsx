import { UserRoleEnum } from "@infrastructure/apis/client";
import { useOwnUserHasRole } from "@infrastructure/hooks/useOwnUser";
import { AppIntlProvider } from "@presentation/components/ui/AppIntlProvider";
import { ToastNotifier } from "@presentation/components/ui/ToastNotifier";
import { HomePage } from "@presentation/pages/HomePage";
import { LoginPage } from "@presentation/pages/LoginPage";
import { RegisterPage } from "@presentation/pages/RegisterPage";
import { AboutPage } from "@presentation/pages/AboutPage";
import { Route, Routes, Navigate } from "react-router-dom";
import { AppRoute } from "routes";

// Client Pages
import { ClientDashboard } from "@presentation/pages/client/ClientDashboard";
import { PetsTable } from "@presentation/pages/client/PetsTable";
import { ClientBookingsTable } from "@presentation/pages/client/ClientBookingsTable";
import { SittersList } from "@presentation/pages/client/SittersList";

// Sitter Pages
import { SitterDashboard } from "@presentation/pages/sitter/SitterDashboard";
import { SitterBookingsView } from "@presentation/pages/sitter/SitterBookingsView";
import { SitterReviews } from "@presentation/pages/sitter/SitterReviews";
import { PublicSitterReviews } from "@presentation/pages/sitter/PublicSitterReviews";

// Common Pages
import { ProfilePage } from "@presentation/pages/profile/ProfilePage";
import { SitterProfilePage } from "@presentation/pages/profile/SitterProfilePage";

// Protected Route Component
interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRoleEnum[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { loggedIn, hasExpired } = useTokenHasExpired();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!loggedIn || hasExpired) {
        return <Navigate to={AppRoute.Login} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role as UserRoleEnum)) {
        return <Navigate to={AppRoute.Index} replace />;
    }

    return <>{children}</>;
};

export function App() {
    const isClient = useOwnUserHasRole(UserRoleEnum.Client);
    const isSitter = useOwnUserHasRole(UserRoleEnum.Sitter);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <AppIntlProvider>
            <ToastNotifier />
            <Routes>
                {/* Public Routes */}
                <Route path={AppRoute.Index} element={<HomePage />} />
                <Route path={AppRoute.About} element={<AboutPage />} />
                <Route path={AppRoute.Login} element={<LoginPage />} />
                <Route path={AppRoute.Register} element={<RegisterPage />} />
                <Route path={AppRoute.PublicSitterReviews} element={<PublicSitterReviews />} />

                {/* Client Routes */}
                <Route
                    path={AppRoute.ClientDashboard}
                    element={
                        <ProtectedRoute allowedRoles={[UserRoleEnum.Client]}>
                            <ClientDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={AppRoute.ClientPets}
                    element={
                        <ProtectedRoute allowedRoles={[UserRoleEnum.Client]}>
                            <PetsTable />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={AppRoute.ClientBookings}
                    element={
                        <ProtectedRoute allowedRoles={[UserRoleEnum.Client]}>
                            <ClientBookingsTable />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={AppRoute.Sitters}
                    element={
                        <ProtectedRoute allowedRoles={[UserRoleEnum.Client]}>
                            <SittersList />
                        </ProtectedRoute>
                    }
                />

                {/* Sitter Routes */}
                <Route
                    path={AppRoute.SitterDashboard}
                    element={
                        <ProtectedRoute allowedRoles={[UserRoleEnum.Sitter]}>
                            <SitterDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={AppRoute.SitterBookings}
                    element={
                        <ProtectedRoute allowedRoles={[UserRoleEnum.Sitter]}>
                            <SitterBookingsView />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={AppRoute.SitterReviews}
                    element={
                        <ProtectedRoute allowedRoles={[UserRoleEnum.Sitter]}>
                            <SitterReviews />
                        </ProtectedRoute>
                    }
                />

                {/* Common Routes */}
                <Route
                    path={AppRoute.Profile}
                    element={
                        <ProtectedRoute allowedRoles={[UserRoleEnum.Client, UserRoleEnum.Sitter]}>
                            {user.role === UserRoleEnum.Sitter ? <SitterProfilePage /> : <ProfilePage />}
                        </ProtectedRoute>
                    }
                />

                {/* Redirect to home for any unmatched routes */}
                <Route path="*" element={<Navigate to={AppRoute.Index} replace />} />
            </Routes>
        </AppIntlProvider>
    );
}