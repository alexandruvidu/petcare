"use client"

import { useDialogController } from "../Dialog.controller"

/**
 * This hook represents the controller for the pet edit dialog.
 */
export const usePetEditDialogController = (initialOpen: boolean, onClose: () => void) => {
  const dialogController = useDialogController()

  return {
    ...dialogController,
    isOpen: initialOpen,
    close: onClose,
  }
}
