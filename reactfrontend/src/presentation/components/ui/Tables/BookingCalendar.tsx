import React, { useMemo } from 'react';
import { Calendar, dateFnsLocalizer, EventProps, View } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enUS } from 'date-fns/locale/en-US';
import { ro } from 'date-fns/locale/ro';
import { Locale } from 'date-fns'; // CORRECTED: Import Locale from date-fns directly
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { BookingDTO, BookingStatusEnum } from '@infrastructure/apis/client';
import { Box, Chip, Paper, Tooltip, Typography } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

const locales: { [key: string]: Locale } = {
    'en': enUS,
    'ro': ro,
};

interface BookingEvent extends BookingDTO {
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    resource?: any;
}

interface BookingCalendarProps {
    bookings: BookingDTO[];
    onSelectBooking: (booking: BookingDTO) => void; // This is what CustomEvent needs to work with
    defaultView?: View;
    height?: string | number;
}

const getEventStyle = (event: BookingEvent) => {
    let backgroundColor = '#cccccc';
    switch (event.status) {
        case BookingStatusEnum.Pending: backgroundColor = '#ffc107'; break;
        case BookingStatusEnum.Accepted: backgroundColor = '#4caf50'; break;
        case BookingStatusEnum.Rejected: backgroundColor = '#f44336'; break;
        case BookingStatusEnum.Completed: backgroundColor = '#2196f3'; break;
        // default: // No default needed if BookingStatusEnum is exhaustive and event.status is always valid
    }
    return {
        style: {
            backgroundColor,
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block',
            padding: '2px 5px',
            fontSize: '0.8em'
        }
    };
};

const CustomEvent: React.FC<EventProps<BookingEvent>> = ({ event }) => {
    const { formatMessage } = useIntl();

    const getStatusLabel = (status: BookingStatusEnum): string => {
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

    const getShortStatusLabel = (status: BookingStatusEnum): string => {
        switch (status) {
            case BookingStatusEnum.Pending:
                return formatMessage({ id: "booking.status.short.pending" });
            case BookingStatusEnum.Accepted:
                return formatMessage({ id: "booking.status.short.accepted" });
            case BookingStatusEnum.Rejected:
                return formatMessage({ id: "booking.status.short.rejected" });
            case BookingStatusEnum.Completed:
                return formatMessage({ id: "booking.status.short.completed" });
            default:
                const exhaustiveCheck: never = status;
                return String(exhaustiveCheck);
        }
    };


    return (
        <Tooltip title={
            <Box>
                <Typography variant="subtitle2">{event.title}</Typography>
                <Typography variant="caption" display="block">
                    <FormattedMessage id="booking.status" />: {getStatusLabel(event.status)}
                </Typography>
                <Typography variant="caption" display="block">
                    {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                    {new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
            </Box>
        }>
            <Box sx={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                {event.title}
                <Chip
                    label={getShortStatusLabel(event.status)}
                    size="small"
                    sx={{ml:0.5, fontSize: '0.7em', height: '16px',
                        backgroundColor: getEventStyle(event).style.backgroundColor,
                        color: 'white'
                    }}/>
            </Box>
        </Tooltip>
    );
};


export const BookingCalendarComponent: React.FC<BookingCalendarProps> = ({ bookings, onSelectBooking, defaultView = 'month', height = '70vh' }) => {
    const { locale } = useIntl();
    const currentLocale = locales[locale as keyof typeof locales] || enUS;

    const localizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek: (date: Date, options?: { locale?: Locale; weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 }) =>
            startOfWeek(date, { locale: options?.locale || currentLocale, weekStartsOn: options?.weekStartsOn }),
        getDay,
        locales, // Pass the locales map here for react-big-calendar to use
    });

    const events: BookingEvent[] = useMemo(() => bookings.map(b => ({
        ...b,
        title: b.petName || `Booking for ${b.clientName || b.sitterName || 'Unknown'}`, // Provide a default title
        start: new Date(b.startDate),
        end: new Date(b.endDate),
    })), [bookings]);

    // Type assertion for onSelectEvent
    const handleSelectEvent = (event: object) => {
        onSelectBooking(event as BookingEvent); // Cast to BookingEvent which extends BookingDTO
    };

    return (
        <Paper sx={{ p: 2, height: height }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView={defaultView}
                views={['month', 'week', 'day', 'agenda']}
                style={{ height: '100%' }}
                onSelectEvent={handleSelectEvent} // Use the typed handler
                eventPropGetter={getEventStyle}
                components={{
                    event: CustomEvent,
                }}
                culture={locale} // react-big-calendar uses this to pick from `locales` in localizer
            />
        </Paper>
    );
};