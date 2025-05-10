"use client"

import { useDialogController } from "../Dialog.controller"

/**
 * This hook represents the controller for the pet add dialog.
 */
export const usePetAddDialogController = () => {
  const dialogController = useDialogController()

  return {
    ...dialogController,
  }
}
