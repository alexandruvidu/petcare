import React, { Fragment, useState } from 'react';
import { WebsiteLayout } from "@presentation/layouts/WebsiteLayout";
import { Seo } from "@presentation/components/ui/Seo";
import { useIntl, FormattedMessage } from 'react-intl';
import { Container, Typography, Box, Button, Modal, Paper, Chip, Tooltip, IconButton, Tabs, Tab } from '@mui/material';
import { useGetMyBookings } from '@infrastructure/apis/api-management'; // useUpdateBooking is in BookingForm
import { DataLoadingContainer } from '@presentation/components/ui/LoadingDisplay';
import { DataTable, DataTableColumn } from '@presentation/components/ui/Tables/DataTable/DataTable';
import { BookingDTO, BookingStatusEnum, UserRoleEnum } from '@infrastructure/apis/client';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { BookingForm } from '@presentation/components/forms/Booking/BookingForm';
import { BookingDetailDialog } from '@presentation/components/ui/Dialogs/BookingDetailDialog';
import { BookingCalendarComponent } from '@presentation/components/ui/Tables/BookingCalendar';
import { dateToDatetimeString } from '@infrastructure/utils/dateUtils';
// import { toast } from 'react-toastify'; // Not directly used for toast in this component

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 500, md: 600 },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: '90vh',
    overflowY: 'auto'
};

const getStatusChipColor = (status: BookingStatusEnum): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" | undefined => {
    switch (status) {
        case BookingStatusEnum.Pending: return "warning";
        case BookingStatusEnum.Accepted: return "success";
        case BookingStatusEnum.Rejected: return "error";
        case BookingStatusEnum.Completed: return "info";
        default: return "default";
    }
};

export const SitterBookingsView: React.FC = () => {
    const { formatMessage } = useIntl();
    const { data: bookingsDataResponse, isLoading, isError, refetch } = useGetMyBookings();

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState<BookingDTO | undefined>(undefined);

    const [detailBooking, setDetailBooking] = useState<BookingDTO | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const handleOpenFormModal = (booking: BookingDTO) => {
        setEditingBooking(booking);
        setIsFormModalOpen(true);
    };
    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
        setEditingBooking(undefined);
        refetch();
    };

    const handleViewDetails = (booking: BookingDTO) => {
        setDetailBooking(booking);
        setIsDetailModalOpen(true);
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

    const columns: DataTableColumn<BookingDTO>[] = [
        { key: 'petName', name: formatMessage({ id: 'pet.name' }), render: (val, entry) => entry.petName || "N/A" },
        { key: 'clientName', name: formatMessage({ id: 'globals.client' }), render: (val, entry) => entry.clientName || "N/A"},
        { key: 'startDate', name: formatMessage({ id: 'booking.startDate' }), render: (value: Date) => dateToDatetimeString(new Date(value)) },
        { key: 'endDate', name: formatMessage({ id: 'booking.endDate' }), render: (value: Date) => dateToDatetimeString(new Date(value)) },
        {
            key: 'status',
            name: formatMessage({ id: 'booking.status' }),
            render: (value: BookingStatusEnum) => (
                <Chip
                    label={getBookingStatusLabel(value)} // Use the helper function
                    color={getStatusChipColor(value)}
                    size="small"
                />
            )
        },
        {
            key: 'actions',
            name: formatMessage({ id: 'labels.actions' }),
            align: 'right',
            render: (_, entry: BookingDTO) => (
                <Box>
                    <Tooltip title={formatMessage({id: "labels.viewDetails"})}>
                        <IconButton onClick={() => handleViewDetails(entry)} color="info" size="small">
                            <VisibilityIcon fontSize="small"/>
                        </IconButton>
                    </Tooltip>
                    {(entry.status === BookingStatusEnum.Pending || entry.status === BookingStatusEnum.Accepted) && (
                        <Tooltip title={formatMessage({id: "booking.updateStatus"})}>
                            <IconButton onClick={() => handleOpenFormModal(entry)} color="primary" size="small">
                                <EditIcon fontSize="small"/>
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            )
        }
    ];

    const bookings = bookingsDataResponse?.response || [];

    return (
        <Fragment>
            <Seo title={formatMessage({ id: 'sitter.bookings.title' })} />
            <WebsiteLayout>
                <Container maxWidth="xl">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h4" component="h1">
                            <FormattedMessage id="nav.myBookings" />
                        </Typography>
                        <Tabs value={viewMode} onChange={(_, newValue) => setViewMode(newValue as 'list' | 'calendar')} indicatorColor="primary" textColor="primary">
                            <Tab label={formatMessage({id: "viewMode.list"})} value="list" />
                            <Tab label={formatMessage({id: "viewMode.calendar"})} value="calendar" />
                        </Tabs>
                    </Box>
                    <DataLoadingContainer isLoading={isLoading} isError={isError} tryReload={refetch}>
                        {viewMode === 'list' ? (
                            <DataTable
                                columns={columns}
                                data={bookings} // Pass full dataset
                                totalCount={bookings.length}
                                page={page}
                                pageSize={pageSize}
                                onPageChange={setPage}
                                onPageSizeChange={(newPageSize) => { setPageSize(newPageSize); setPage(0); }}
                                isLoading={isLoading}
                                noDataMessage={formatMessage({id: "sitter.bookings.noBookings"})}
                                title={formatMessage({id: "sitter.bookings.listTitle"})}
                            />
                        ) : (
                            <BookingCalendarComponent
                                bookings={bookings}
                                onSelectBooking={handleViewDetails}
                            />
                        )}
                    </DataLoadingContainer>
                </Container>
            </WebsiteLayout>

            <Modal open={isFormModalOpen} onClose={handleCloseFormModal}>
                <Paper sx={modalStyle}>
                    <BookingForm
                        isEdit={true}
                        initialData={editingBooking}
                        onSubmitSuccess={handleCloseFormModal}
                        userRole={UserRoleEnum.Sitter}
                    />
                </Paper>
            </Modal>

            {detailBooking && (
                <BookingDetailDialog
                    booking={detailBooking}
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    userRole={UserRoleEnum.Sitter}
                    onUpdateStatus={handleOpenFormModal}
                />
            )}
        </Fragment>
    );
};