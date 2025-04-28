import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Button,
    Divider
} from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { useAppSelector } from '@application/store';
import { UserRoleEnum } from '@infrastructure/apis/client';
import PetsIcon from '@mui/icons-material/Pets';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import NotesIcon from '@mui/icons-material/Notes';
import { ReviewForm } from '@presentation/components/forms/Review/ReviewForm';
import { useGetBookingReview } from '@infrastructure/apis/api-management';

interface BookingDetailCardProps {
    booking: any;
    onEdit?: () => void;
    onDelete?: () => void;
    onClose?: () => void;
}

/**
 * Card component for displaying booking details
 */
export const BookingDetailCard = ({ booking, onEdit, onDelete, onClose }: BookingDetailCardProps) => {
    const [showReviewForm, setShowReviewForm] = useState(false);
    const { formatMessage } = useIntl();
    const { user } = useAppSelector(state => state.profileReducer);
    const { data: existingReview } = useGetBookingReview(booking?.id);

    const userRole = user?.role;
    const isClient = userRole === UserRoleEnum.Client;
    const isSitter = userRole === UserRoleEnum.Sitter;

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending':
                return 'warning';
            case 'Accepted':
                return 'success';
            case 'Rejected':
                return 'error';
            case 'Completed':
                return 'info';
            default:
                return 'default';
        }
    };

    const getDuration = () => {
        const start = new Date(booking.startDate);
        const end = new Date(booking.endDate);

        // Calculate difference in milliseconds
        const diffTime = Math.abs(end.getTime() - start.getTime());

        // Convert to days, hours, minutes
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

        // Format the duration string
        let durationString = '';
        if (diffDays > 0) {
            durationString += `${diffDays} ${diffDays > 1 ?
                formatMessage({ id: 'time.days', defaultMessage: 'days' }) :
                formatMessage({ id: 'time.day', defaultMessage: 'day' })
                } `;
        }
        if (diffHours > 0 || diffDays > 0) {
            durationString += `${diffHours} ${diffHours > 1 ?
                formatMessage({ id: 'time.hours', defaultMessage: 'hours' }) :
                formatMessage({ id: 'time.hour', defaultMessage: 'hour' })
                } `;
        }
        durationString += `${diffMinutes} ${diffMinutes > 1 ?
            formatMessage({ id: 'time.minutes', defaultMessage: 'minutes' }) :
            formatMessage({ id: 'time.minute', defaultMessage: 'minute' })
            }`;

        return durationString;
    };

    const handleReviewSubmitSuccess = () => {
        setShowReviewForm(false);
    };

    return (
        <Card elevation={3}>
            <CardContent>
                {/* Header with status and ID */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Chip
                        label={booking.status}
                        color={getStatusColor(booking.status) as any}
                        sx={{ fontWeight: 'bold' }}
                    />
                    <Typography variant="body2" color="text.secondary">
                        ID: {booking.id.substring(0, 8)}...
                    </Typography>
                </Box>

                {/* Pet and People Information */}
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', gap: 4 }}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PetsIcon fontSize="small" sx={{ mr: 1 }} />
                                <Typography variant="subtitle2" color="text.secondary">
                                    <FormattedMessage id="booking.pet" defaultMessage="Pet" />
                                </Typography>
                            </Box>
                            <Typography variant="body1">
                                {booking.petName || formatMessage({ id: 'booking.notSpecified', defaultMessage: 'Not specified' })}
                            </Typography>
                        </Box>

                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                                <Typography variant="subtitle2" color="text.secondary">
                                    {isClient ?
                                        <FormattedMessage id="booking.sitter" defaultMessage="Sitter" /> :
                                        <FormattedMessage id="booking.client" defaultMessage="Client" />
                                    }
                                </Typography>
                            </Box>
                            <Typography variant="body1">
                                {isClient ? booking.sitterName : booking.clientName}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Schedule Information */}
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <EventIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="subtitle2" color="text.secondary">
                            <FormattedMessage id="booking.schedule" defaultMessage="Schedule" />
                        </Typography>
                    </Box>

                    <Box sx={{ pl: 4, mb: 2 }}>
                        <Box sx={{ mb: 1 }}>
                            <Typography variant="subtitle2" component="span" color="text.secondary">
                                <FormattedMessage id="booking.start" defaultMessage="Start:" />
                            </Typography>
                            <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                                {formatDateTime(booking.startDate)}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 1 }}>
                            <Typography variant="subtitle2" component="span" color="text.secondary">
                                <FormattedMessage id="booking.end" defaultMessage="End:" />
                            </Typography>
                            <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                                {formatDateTime(booking.endDate)}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" component="span" color="text.secondary">
                                <FormattedMessage id="booking.duration" defaultMessage="Duration:" />
                            </Typography>
                            <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                                {getDuration()}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Notes */}
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <NotesIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="subtitle2" color="text.secondary">
                            <FormattedMessage id="booking.notes" defaultMessage="Notes" />
                        </Typography>
                    </Box>
                    <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1, minHeight: '60px' }}>
                        {booking.notes ? (
                            <Typography variant="body2">{booking.notes}</Typography>
                        ) : (
                            <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                <FormattedMessage id="booking.noNotes" defaultMessage="No notes provided" />
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                    {isClient && booking.status === 'Completed' && !showReviewForm && !existingReview && (
                        <Button
                            variant="outlined"
                            color="warning"
                            onClick={() => setShowReviewForm(true)}
                        >
                            <FormattedMessage id="booking.leaveReview" defaultMessage="Leave Review" />
                        </Button>
                    )}

                    {isClient && booking.status === 'Completed' && !showReviewForm && existingReview && (
                        <Button
                            variant="outlined"
                            color="warning"
                            onClick={() => setShowReviewForm(true)}
                        >
                            <FormattedMessage id="booking.updateReview" defaultMessage="Update Review" />
                        </Button>
                    )}

                    {onDelete && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={onDelete}
                        >
                            <FormattedMessage id="forms.delete" defaultMessage="Delete" />
                        </Button>
                    )}

                    {onEdit && (
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={onEdit}
                        >
                            <FormattedMessage id="forms.edit" defaultMessage="Edit" />
                        </Button>
                    )}

                    {onClose && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onClose}
                        >
                            <FormattedMessage id="forms.close" defaultMessage="Close" />
                        </Button>
                    )}
                </Box>

                {/* Review Form */}
                {showReviewForm && (
                    <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="h6" gutterBottom>
                            {existingReview ?
                                <FormattedMessage id="review.updateTitle" defaultMessage="Update Your Review" /> :
                                <FormattedMessage id="review.title" defaultMessage="Leave a Review" />
                            }
                        </Typography>
                        <ReviewForm
                            booking={booking}
                            existingReview={existingReview}
                            onSubmitSuccess={handleReviewSubmitSuccess}
                            onCancel={() => setShowReviewForm(false)}
                        />
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};