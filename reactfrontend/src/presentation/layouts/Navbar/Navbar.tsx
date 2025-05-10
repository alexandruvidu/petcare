"use client"

import { useCallback } from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Button from "@mui/material/Button"
import HomeIcon from "@mui/icons-material/Home"
import { Link } from "react-router-dom"
import { AppRoute } from "routes"
import { useIntl } from "react-intl"
import { useAppDispatch, useAppSelector } from "@application/store"
import { IconButton } from "@mui/material"
import { resetProfile } from "@application/state-slices"
import { useAppRouter } from "@infrastructure/hooks/useAppRouter"
import { NavbarLanguageSelector } from "@presentation/components/ui/NavbarLanguageSelector/NavbarLanguageSelector"
import { useOwnUserHasRole } from "@infrastructure/hooks/useOwnUser"
import { UserRoleEnum } from "@infrastructure/apis/client"

/**
 * This is the navigation menu that will stay at the top of the page.
 */
export const Navbar = () => {
  const { formatMessage } = useIntl()
  const { loggedIn } = useAppSelector((x) => x.profileReducer)
  const isAdmin = useOwnUserHasRole(UserRoleEnum.Admin)
  const isPetSitter = useOwnUserHasRole(UserRoleEnum.PetSitter)
  const isUser = useOwnUserHasRole(UserRoleEnum.User)
  const dispatch = useAppDispatch()
  const { redirectToHome } = useAppRouter()
  const logout = useCallback(() => {
    dispatch(resetProfile())
    redirectToHome()
  }, [dispatch, redirectToHome])

  return (
    <>
      <div className="w-full top-0 z-50 fixed">
        <AppBar>
          <Toolbar>
            <div className="grid grid-cols-12 gap-y-5 gap-x-5 justify-center items-center">
              <div className="col-span-1">
                <Link to={AppRoute.Index}>
                  <IconButton>
                    <HomeIcon style={{ color: "white" }} fontSize="large" />
                  </IconButton>
                </Link>
              </div>

              {loggedIn && (
                <>
                  <div className="col-span-1">
                    <Button color="inherit">
                      <Link style={{ color: "white" }} to={AppRoute.Pets}>
                        {formatMessage({ id: "globals.pets" })}
                      </Link>
                    </Button>
                  </div>

                  <div className="col-span-1">
                    <Button color="inherit">
                      <Link style={{ color: "white" }} to={AppRoute.SitterProfiles}>
                        {formatMessage({ id: "globals.sitters" })}
                      </Link>
                    </Button>
                  </div>

                  <div className="col-span-1">
                    <Button color="inherit">
                      <Link style={{ color: "white" }} to={AppRoute.Bookings}>
                        {formatMessage({ id: "globals.bookings" })}
                      </Link>
                    </Button>
                  </div>

                  <div className="col-span-1">
                    <Button color="inherit">
                      <Link style={{ color: "white" }} to={AppRoute.Reviews}>
                        {formatMessage({ id: "globals.reviews" })}
                      </Link>
                    </Button>
                  </div>

                  <div className="col-span-1">
                    <Button color="inherit">
                      <Link style={{ color: "white" }} to={AppRoute.Feedback}>
                        {formatMessage({ id: "globals.feedback" })}
                      </Link>
                    </Button>
                  </div>
                </>
              )}

              {isAdmin && (
                <>
                  <div className="col-span-1">
                    <Button color="inherit">
                      <Link style={{ color: "white" }} to={AppRoute.Users}>
                        {formatMessage({ id: "globals.users" })}
                      </Link>
                    </Button>
                  </div>
                  <div className="col-span-1">
                    <Button color="inherit">
                      <Link style={{ color: "white" }} to={AppRoute.UserFiles}>
                        {formatMessage({ id: "globals.files" })}
                      </Link>
                    </Button>
                  </div>
                </>
              )}

              <div className="-col-end-2 col-span-1">
                <NavbarLanguageSelector />
              </div>

              <div className="-col-end-1 col-span-1">
                {!loggedIn && (
                  <>
                    <Button color="inherit" className="mr-2">
                      <Link style={{ color: "white" }} to={AppRoute.Login}>
                        {formatMessage({ id: "globals.login" })}
                      </Link>
                    </Button>
                    <Button color="inherit">
                      <Link style={{ color: "white" }} to={AppRoute.Register}>
                        {formatMessage({ id: "globals.register" })}
                      </Link>
                    </Button>
                  </>
                )}
                {loggedIn && (
                  <Button onClick={logout} color="inherit">
                    {formatMessage({ id: "globals.logout" })}
                  </Button>
                )}
              </div>
            </div>
          </Toolbar>
        </AppBar>
      </div>
      <div className="w-full top-0 z-49">
        <div className="min-h-20" />
      </div>
    </>
  )
}
