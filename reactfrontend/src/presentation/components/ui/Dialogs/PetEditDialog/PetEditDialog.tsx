"use client"

import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material"
import { useIntl } from "react-intl"
import { usePetEditDialogController } from "./PetEditDialog.controller"
import { PetEditForm } from "@presentation/components/forms/Pet"
import CloseIcon from "@mui/icons-material/Close"

/**
 * This component represents a dialog to edit a pet.
 */
export const PetEditDialog = ({
  open,
  onClose,
  petId,
}: {
  open: boolean
  onClose: () => void
  petId: string
}) => {
  const { formatMessage } = useIntl()
  const { isOpen, close } = usePetEditDialogController(open, onClose)

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="md" fullWidth>
      <DialogTitle>
        {formatMessage({ id: "globals.edit" })} {formatMessage({ id: "globals.pet" })}
        <IconButton
          aria-label="close"
          onClick={close}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <PetEditForm petId={petId} onSuccess={close} />
      </DialogContent>
    </Dialog>
  )
}
