"use client"

import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { AppRoute } from "routes"

/**
 * This hook is used to navigate to different pages in the application.
 */
export const useAppRouter = () => {
  const navigate = useNavigate()

  const redirectToHome = useCallback(() => {
    navigate(AppRoute.Index)
  }, [navigate])

  const redirectToLogin = useCallback(() => {
    navigate(AppRoute.Login)
  }, [navigate])

  const redirectToRegister = useCallback(() => {
    navigate(AppRoute.Register)
  }, [navigate])

  const redirectToPets = useCallback(() => {
    navigate(AppRoute.Pets)
  }, [navigate])

  const redirectToSitterProfiles = useCallback(() => {
    navigate(AppRoute.SitterProfiles)
  }, [navigate])

  const redirectToBookings = useCallback(() => {
    navigate(AppRoute.Bookings)
  }, [navigate])

  const redirectToReviews = useCallback(() => {
    navigate(AppRoute.Reviews)
  }, [navigate])

  return {
    redirectToHome,
    redirectToLogin,
    redirectToRegister,
    redirectToPets,
    redirectToSitterProfiles,
    redirectToBookings,
    redirectToReviews,
  }
}
