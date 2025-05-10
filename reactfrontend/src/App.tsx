import { UserRoleEnum } from "@infrastructure/apis/client"
import { useOwnUserHasRole } from "@infrastructure/hooks/useOwnUser"
import { AppIntlProvider } from "@presentation/components/ui/AppIntlProvider"
import { ToastNotifier } from "@presentation/components/ui/ToastNotifier"
import { HomePage } from "@presentation/pages/HomePage"
import { LoginPage } from "@presentation/pages/LoginPage"
import { UserFilesPage } from "@presentation/pages/UserFilesPage"
import { UsersPage } from "@presentation/pages/UsersPage"
import { Route, Routes } from "react-router-dom"
import { AppRoute } from "routes"
import { Outlet } from "react-router-dom"

export function App() {
  const isAdmin = useOwnUserHasRole(UserRoleEnum.Admin)

  return (
    <AppIntlProvider>
      <ToastNotifier />
      <Routes>
        <Route path={AppRoute.Index} element={<HomePage />} />
        <Route path={AppRoute.Login} element={<LoginPage />} />
        {isAdmin && <Route path={AppRoute.Users} element={<UsersPage />} />}
        {isAdmin && <Route path={AppRoute.UserFiles} element={<UserFilesPage />} />}
      </Routes>
      <Outlet />
    </AppIntlProvider>
  )
}

export default App
