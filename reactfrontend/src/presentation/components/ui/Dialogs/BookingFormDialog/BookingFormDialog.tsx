import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FormattedMessage } from 'react-intl';
import { BookingForm } from '@presentation/components/forms/Booking/BookingForm';

interface BookingFormDialogProps {
    open: boolean;
    onClose: () => void;
    booking?: any;
}

/**
 * Dialog component for creating or editing a booking
 */
export const BookingFormDialog = ({ open, onClose, booking }: BookingFormDialogProps) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="booking-form-dialog-title"
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle id="booking-form-dialog-title">
                {booking ? (
                    <FormattedMessage id="dialogs.booking.editTitle" defaultMessage="Edit Booking" />
                ) : (
                    <FormattedMessage id="dialogs.booking.createTitle" defaultMessage="Create Booking" />
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
                <BookingForm
                    booking={booking}
                    onSubmit={onClose}
                    onCancel={onClose}
                />
            </DialogContent>
        </Dialog>
    );
};