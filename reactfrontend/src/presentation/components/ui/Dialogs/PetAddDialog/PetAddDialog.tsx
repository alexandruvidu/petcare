"use client"

import { Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material"
import { FormattedMessage, useIntl } from "react-intl"
import { usePetAddDialogController } from "./PetAddDialog.controller"
import { PetAddForm } from "@presentation/components/forms/Pet"
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"

/**
 * This component represents a dialog to add a new pet.
 */
export const PetAddDialog = () => {
  const { formatMessage } = useIntl()
  const { isOpen, open, close } = usePetAddDialogController()

  return (
    <>
      <Button variant="contained" color="primary" onClick={open} startIcon={<AddIcon />}>
        <FormattedMessage id="globals.add" /> <FormattedMessage id="globals.pet" />
      </Button>
      <Dialog open={isOpen} onClose={close} maxWidth="md" fullWidth>
        <DialogTitle>
          {formatMessage({ id: "globals.add" })} {formatMessage({ id: "globals.pet" })}
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
          <PetAddForm onSuccess={close} />
        </DialogContent>
      </Dialog>
    </>
  )
}
