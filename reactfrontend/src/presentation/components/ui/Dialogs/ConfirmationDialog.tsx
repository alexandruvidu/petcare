import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
                                                                          isOpen,
                                                                          onClose,
                                                                          onConfirm,
                                                                          title,
                                                                          message,
                                                                      }) => {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            aria-labelledby="confirmation-dialog-title"
            aria-describedby="confirmation-dialog-description"
        >
            <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="confirmation-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    <FormattedMessage id="buttons.cancel" />
                </Button>
                <Button onClick={onConfirm} color="primary" autoFocus>
                    <FormattedMessage id="labels.confirm" /> {/* i18n: labels.confirm */}
                </Button>
            </DialogActions>
        </Dialog>
    );
};