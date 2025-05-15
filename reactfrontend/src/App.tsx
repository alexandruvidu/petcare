import { UserRoleEnum } from "@infrastructure/apis/client";
import { useTokenHasExpired } from "@infrastructure/hooks/useOwnUser";
import { AppIntlProvider } from "@presentation/components/ui/AppIntlProvider";
import { ToastNotifier } from "@presentation/components/ui/ToastNotifier";
import { HomePage } from "@presentation/pages/HomePage";
import { LoginPage } from "@presentation/pages/LoginPage";
import { RegisterPage } from "@presentation/pages/RegisterPage";
import { AboutPage } from "@presentation/pages/AboutPage";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { AppRoute } from "routes";
import { useEffect, useState } from "react";

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

// Admin Pages
import { UsersPage as AdminUsersPage } from "@presentation/pages/UsersPage";


// Protected Route Component
interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRoleEnum[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { loggedIn, hasExpired } = useTokenHasExpired();
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : {};
    const userRole = user.role as UserRoleEnum | undefined;

    if (!loggedIn || hasExpired || !storedUser || !userRole) {
        return <Navigate to={AppRoute.Login} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        if (userRole === UserRoleEnum.Client) return <Navigate to={AppRoute.ClientDashboard} replace />;
        if (userRole === UserRoleEnum.Sitter) return <Navigate to={AppRoute.SitterDashboard} replace />;
        if (userRole === UserRoleEnum.Admin) return <Navigate to={AppRoute.AdminUsers} replace />
        return <Navigate to={AppRoute.Index} replace />;
    }

    return <>{children}</>;
};

const DynamicProfileRouter = () => {
    const [userRole, setUserRole] = useState<UserRoleEnum | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const checkUserRole = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const userData = JSON.parse(storedUser);
                    setUserRole(userData.role as UserRoleEnum);
                } catch (e) {
                    console.error("Error parsing user data:", e);
                    setUserRole(undefined);
                }
            } else {
                setUserRole(undefined);
            }
            setIsLoading(false);
        };

        checkUserRole();
        window.addEventListener('storage', checkUserRole);
        window.addEventListener('login', checkUserRole);

        return () => {
            window.removeEventListener('storage', checkUserRole);
            window.removeEventListener('login', checkUserRole);
        };
    }, [location.pathname]);

    if (isLoading) {
        return null;
    }

    if (userRole === UserRoleEnum.Sitter) {
        return <SitterProfilePage key="sitter-profile" />;
    } else if (userRole === UserRoleEnum.Client || userRole === UserRoleEnum.Admin) {
        return <ProfilePage key="client-admin-profile" />;
    }

    return <Navigate to={AppRoute.Index} replace />;
};

export function App() {
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

                {/* Common Protected Route */}
                <Route
                    path={AppRoute.Profile}
                    element={
                        <ProtectedRoute allowedRoles={[UserRoleEnum.Client, UserRoleEnum.Sitter, UserRoleEnum.Admin]}>
                            <DynamicProfileRouter />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Routes */}
                <Route
                    path={AppRoute.AdminUsers}
                    element={
                        <ProtectedRoute allowedRoles={[UserRoleEnum.Admin]}>
                            <AdminUsersPage />
                        </ProtectedRoute>
                    }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to={AppRoute.Index} replace />} />
            </Routes>
        </AppIntlProvider>
    );
}