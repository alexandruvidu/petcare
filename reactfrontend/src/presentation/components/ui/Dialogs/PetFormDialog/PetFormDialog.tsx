import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FormattedMessage } from 'react-intl';
import { PetForm } from '@presentation/components/forms/Pet/PetForm';

interface PetFormDialogProps {
  open: boolean;
  onClose: () => void;
  pet?: {
    id: string;
    name: string;
    type: string;
    breed: string;
    age: number;
  };
}

/**
 * Dialog component for adding or editing a pet
 */
export const PetFormDialog = ({ open, onClose, pet }: PetFormDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="pet-form-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="pet-form-dialog-title">
        {pet ? (
          <FormattedMessage id="dialogs.pet.editTitle" defaultMessage="Edit Pet" />
        ) : (
          <FormattedMessage id="dialogs.pet.addTitle" defaultMessage="Add New Pet" />
        )}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <PetForm
          pet={pet}
          onSubmit={onClose}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};