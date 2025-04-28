import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Generic confirmation dialog component
 */
export const ConfirmationDialog = ({
  open,
  title,
  message,
  onConfirm,
  onCancel
}: ConfirmationDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          <FormattedMessage id="dialogs.confirmation.cancel" defaultMessage="Cancel" />
        </Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          <FormattedMessage id="dialogs.confirmation.confirm" defaultMessage="Confirm" />
        </Button>
      </DialogActions>
    </Dialog>
  );
};