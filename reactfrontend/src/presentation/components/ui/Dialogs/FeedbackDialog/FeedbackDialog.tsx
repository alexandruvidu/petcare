import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FormattedMessage } from 'react-intl';
import { useFeedbackDialogController } from './FeedbackDialog.controller';
import { FeedbackForm } from '@presentation/components/forms/Feedback/FeedbackForm';

interface FeedbackDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ isOpen, onClose }) => {
    const {
        control,
        handleSubmitFromController, // Renamed for clarity
        onValidSubmit,            // Renamed for clarity
        errors,
        isSubmitting,
        close: closeController
    } = useFeedbackDialogController(onClose);

    const handleActualClose = () => {
        closeController();
    };

    return (
        <Dialog open={isOpen} onClose={handleActualClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <FormattedMessage id="feedback.dialogTitle" />
                <IconButton aria-label="close" onClick={handleActualClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <FeedbackForm
                    handleSubmitFromController={handleSubmitFromController}
                    onValidSubmit={onValidSubmit}
                    control={control}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    onCancel={handleActualClose}
                />
            </DialogContent>
        </Dialog>
    );
};