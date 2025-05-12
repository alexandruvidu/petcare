import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Box, Chip, Grid, IconButton, CircularProgress
} from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { BookingDTO, BookingStatusEnum, UserRoleEnum, ReviewDTO } from '@infrastructure/apis/client';
import { dateToDatetimeString } from '@infrastructure/utils/dateUtils';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { ReviewForm } from '@presentation/components/forms/Review/ReviewForm';
import { useGetReviewByBooking } from '@infrastructure/apis/api-management';

interface BookingDetailDialogProps {
    booking: BookingDTO | null;
    isOpen: boolean;
    onClose: () => void;
    userRole: UserRoleEnum;
    onEdit?: (booking: BookingDTO) => void;
    onDelete?: (booking: BookingDTO) => void;
    onUpdateStatus?: (booking: BookingDTO) => void;
}

const getStatusChipColor = (status?: BookingStatusEnum): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" | undefined => {
    if (!status) return "default";
    switch (status) {
        case BookingStatusEnum.Pending: return "warning";
        case BookingStatusEnum.Accepted: return "success";
        case BookingStatusEnum.Rejected: return "error";
        case BookingStatusEnum.Completed: return "info";
        default: return "default";
    }
};

const getDuration = (startDateString?: Date, endDateString?: Date): string => {
    if (!startDateString || !endDateString) return "N/A";
    const start = new Date(startDateString);
    const end = new Date(endDateString);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return "Invalid Dates";

    const diffTime = Math.abs(end.getTime() - start.getTime());

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

    let durationString = '';
    if (diffDays > 0) durationString += `${diffDays} day${diffDays > 1 ? 's' : ''} `;
    if (diffHours > 0 || diffDays > 0) durationString += `${diffHours} hour${diffHours > 1 ? 's' : ''} `;
    durationString += `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;

    return durationString.trim() || "0 minutes";
};


export const BookingDetailDialog: React.FC<BookingDetailDialogProps> = ({
                                                                            booking, isOpen, onClose, userRole, onEdit, onDelete, onUpdateStatus
                                                                        }) => {
    const { formatMessage } = useIntl();
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [existingReviewForBooking, setExistingReviewForBooking] = useState<ReviewDTO | null>(null);
    const [isLoadingReview, setIsLoadingReview] = useState(false);

    const { data: fetchedReviewData, refetch: refetchReviewByBooking } = useGetReviewByBooking(
        (isOpen && booking && userRole === UserRoleEnum.Client && booking.status === BookingStatusEnum.Completed) ? booking.id : null,
    );

    useEffect(() => {
        if (isOpen && booking && userRole === UserRoleEnum.Client && booking.status === BookingStatusEnum.Completed) {
            setIsLoadingReview(true);
            refetchReviewByBooking().then(result => {
                setExistingReviewForBooking(result.data?.response || null);
            }).finally(() => setIsLoadingReview(false));
        } else {
            setExistingReviewForBooking(null);
        }
    }, [isOpen, booking, userRole, refetchReviewByBooking]);


    if (!booking) return null;

    const hasReview = !!existingReviewForBooking;

    const canClientEdit = userRole === UserRoleEnum.Client && (booking.status === BookingStatusEnum.Pending || booking.status === BookingStatusEnum.Accepted);
    const canClientDelete = userRole === UserRoleEnum.Client && (booking.status === BookingStatusEnum.Pending);
    const canClientReview = userRole === UserRoleEnum.Client && booking.status === BookingStatusEnum.Completed;
    const canSitterUpdateStatus = userRole === UserRoleEnum.Sitter && (booking.status === BookingStatusEnum.Pending || booking.status === BookingStatusEnum.Accepted);

    const handleReviewSubmitSuccess = () => {
        setShowReviewForm(false);
        refetchReviewByBooking();
    };

    const handleCloseDialog = () => {
        setShowReviewForm(false);
        onClose();
    };

    const getBookingStatusLabel = (status: BookingStatusEnum): string => {
        switch (status) {
            case BookingStatusEnum.Pending:
                return formatMessage({ id: "booking.status.pending" });
            case BookingStatusEnum.Accepted:
                return formatMessage({ id: "booking.status.accepted" });
            case BookingStatusEnum.Rejected:
                return formatMessage({ id: "booking.status.rejected" });
            case BookingStatusEnum.Completed:
                return formatMessage({ id: "booking.status.completed" });
            default:
                const exhaustiveCheck: never = status;
                return String(exhaustiveCheck);
        }
    };

    return (
        <Dialog open={isOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth scroll="paper">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                <FormattedMessage id="booking.detail.title" />
                <IconButton aria-label="close" onClick={handleCloseDialog} sx={{color: 'primary.contrastText'}}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip
                        label={booking.status ? getBookingStatusLabel(booking.status) : 'N/A'} // CORRECTED
                        color={getStatusChipColor(booking.status)}
                        size="medium"
                    />
                    <Typography variant="caption" color="text.secondary">
                        ID: {booking.id.substring(0,8)}...
                    </Typography>
                </Box>

                <Grid container spacing={2} sx={{mb: 2}}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="overline" display="block" color="text.secondary"><FormattedMessage id="pet.name" /></Typography>
                        <Typography variant="body1">{booking.petName || "N/A"}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="overline" display="block" color="text.secondary">
                            {userRole === UserRoleEnum.Client ? <FormattedMessage id="globals.sitter" /> : <FormattedMessage id="globals.client" />}
                        </Typography>
                        <Typography variant="body1">{userRole === UserRoleEnum.Client ? booking.sitterName : booking.clientName || "N/A"}</Typography>
                    </Grid>
                </Grid>

                <Box sx={{ bgcolor: 'grey.100', p:2, borderRadius: 1, mb: 2 }}>
                    <Typography variant="overline" display="block" color="text.secondary" sx={{mb:1}}><FormattedMessage id="booking.schedule" /></Typography>
                    <Grid container spacing={1}>
                        <Grid item xs={12}><Typography variant="body2"><strong><FormattedMessage id="booking.startDateShort" />:</strong> {dateToDatetimeString(new Date(booking.startDate))}</Typography></Grid>
                        <Grid item xs={12}><Typography variant="body2"><strong><FormattedMessage id="booking.endDateShort" />:</strong> {dateToDatetimeString(new Date(booking.endDate))}</Typography></Grid>
                        <Grid item xs={12}><Typography variant="body2"><strong><FormattedMessage id="booking.duration" />:</strong> {getDuration(new Date(booking.startDate), new Date(booking.endDate))}</Typography></Grid>
                    </Grid>
                </Box>

                <Typography variant="overline" display="block" color="text.secondary"><FormattedMessage id="booking.notes" /></Typography>
                <Box sx={{ bgcolor: 'grey.100', p:2, borderRadius: 1, minHeight: '60px' }}>
                    <Typography variant="body2" sx={{whiteSpace: 'pre-wrap'}}>
                        {booking.notes || <FormattedMessage id="booking.noNotesProvided" />}
                    </Typography>
                </Box>

                {isLoadingReview && canClientReview && <Box textAlign="center" my={2}><CircularProgress size={24} /></Box>}

                {!isLoadingReview && showReviewForm && canClientReview && (
                    <Box mt={3} borderTop={1} borderColor="divider" pt={2}>
                        <Typography variant="h6" gutterBottom>
                            <FormattedMessage id={hasReview ? "labels.updateReview" : "labels.leaveReview"} />
                        </Typography>
                        <ReviewForm
                            bookingId={booking.id}
                            sitterId={booking.sitterId}
                            onSubmitSuccess={handleReviewSubmitSuccess}
                            existingReview={existingReviewForBooking || undefined}
                        />
                    </Box>
                )}

            </DialogContent>
            <DialogActions sx={{p:2}}>
                {canClientEdit && onEdit && !showReviewForm && (
                    <Button onClick={() => { if(onEdit) onEdit(booking); handleCloseDialog(); }} startIcon={<EditIcon />}>
                        <FormattedMessage id="labels.edit" />
                    </Button>
                )}
                {canClientDelete && onDelete && !showReviewForm && (
                    <Button onClick={() => { if(onDelete) onDelete(booking); handleCloseDialog(); }} color="error" startIcon={<DeleteIcon />}>
                        <FormattedMessage id="labels.delete" />
                    </Button>
                )}
                {canSitterUpdateStatus && onUpdateStatus && !showReviewForm && (
                    <Button onClick={() => { if(onUpdateStatus) onUpdateStatus(booking); handleCloseDialog(); }} startIcon={<EditIcon />}>
                        <FormattedMessage id="booking.updateStatus" />
                    </Button>
                )}
                {!isLoadingReview && canClientReview && !showReviewForm && (
                    <Button onClick={() => setShowReviewForm(true)} startIcon={<RateReviewIcon />} color="secondary">
                        <FormattedMessage id={hasReview ? "labels.updateReview" : "labels.leaveReview"} />
                    </Button>
                )}
                <Button onClick={handleCloseDialog} variant={showReviewForm ? "text" : "outlined"}>
                    <FormattedMessage id={showReviewForm ? "buttons.cancel" : "buttons.close"} />
                </Button>
            </DialogActions>
        </Dialog>
    );
};