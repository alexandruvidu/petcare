import React, { Fragment, useState, useEffect } from 'react';
import { WebsiteLayout } from "@presentation/layouts/WebsiteLayout";
import { Seo } from "@presentation/components/ui/Seo";
import { useIntl, FormattedMessage } from 'react-intl';
import { Container, Typography, Box, IconButton, Button, Modal, Paper, Tooltip, Chip } from '@mui/material';
import { useGetMyBookings, useDeleteBooking, useGetMyPets, useGetAllSitters } from '@infrastructure/apis/api-management';
import { DataLoadingContainer } from '@presentation/components/ui/LoadingDisplay';
import { DataTable, DataTableColumn } from '@presentation/components/ui/Tables/DataTable/DataTable';
import { BookingDTO, BookingStatusEnum, PetDTO, UserDTO, UserRoleEnum } from '@infrastructure/apis/client';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { BookingForm } from '@presentation/components/forms/Booking/BookingForm';
import { ConfirmationDialog } from '@presentation/components/ui/Dialogs/ConfirmationDialog';
import { BookingDetailDialog } from '@presentation/components/ui/Dialogs/BookingDetailDialog';
import { toast } from 'react-toastify';
import { dateToDatetimeString } from '@infrastructure/utils/dateUtils';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from 'routes';
import { BookingAddFormModel } from '@presentation/components/forms/Booking/BookingForm.types'; // For initialData typing

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

export const ClientBookingsTable: React.FC = () => {
    const { formatMessage } = useIntl();
    const navigate = useNavigate();
    const { data: bookingsDataResponse, isLoading, isError, refetch } = useGetMyBookings();
    const { mutateAsync: deleteBookingMutation } = useDeleteBooking();

    const { data: petsData } = useGetMyPets();
    // const { data: sittersData } = useGetAllSitters(); // Not strictly needed for displaying client's bookings table

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState<BookingDTO | undefined>(undefined);

    const [bookingToDelete, setBookingToDelete] = useState<BookingDTO | null>(null);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    const [detailBooking, setDetailBooking] = useState<BookingDTO | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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

    const handleDeleteClick = (booking: BookingDTO) => {
        setBookingToDelete(booking);
        setIsConfirmDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (bookingToDelete) {
            try {
                await deleteBookingMutation(bookingToDelete.id);
                toast.success(formatMessage({ id: 'success.bookingDeleted' }));
                refetch();
            } catch (e: any) {
                const apiErrorMessage = e?.response?.data?.errorMessage?.message || e?.message;
                toast.error(apiErrorMessage || formatMessage({ id: 'error.defaultApi' }));
            }
        }
        setIsConfirmDialogOpen(false);
        setBookingToDelete(null);
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
        { key: 'sitterName', name: formatMessage({ id: 'globals.sitter' }), render: (val, entry) => entry.sitterName || "N/A"},
        { key: 'startDate', name: formatMessage({ id: 'booking.startDate' }), render: (value: Date) => dateToDatetimeString(new Date(value)) },
        { key: 'endDate', name: formatMessage({ id: 'booking.endDate' }), render: (value: Date) => dateToDatetimeString(new Date(value)) },
        {
            key: 'status',
            name: formatMessage({ id: 'booking.status' }),
            render: (value: BookingStatusEnum) => (
                <Chip
                    label={getBookingStatusLabel(value)} // CORRECTED: Use helper function
                    color={getStatusChipColor(value)}
                    size="small"
                />
            )
        },
        { // New actions column for ClientBookingsTable
            key: 'actions_client_bookings', // Unique key
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
                        <Tooltip title={formatMessage({id: "labels.editBooking"})}>
                            <IconButton onClick={() => handleOpenFormModal(entry)} color="primary" size="small">
                                <EditIcon fontSize="small"/>
                            </IconButton>
                        </Tooltip>
                    )}
                    {entry.status === BookingStatusEnum.Pending && (
                        <Tooltip title={formatMessage({id: "labels.deleteBooking"})}>
                            <IconButton onClick={() => handleDeleteClick(entry)} color="error" size="small">
                                <DeleteIcon fontSize="small"/>
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
            <Seo title={formatMessage({ id: 'client.bookings.title' })} />
            <WebsiteLayout>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h4" component="h1">
                            <FormattedMessage id="nav.myBookings" />
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={() => navigate(AppRoute.Sitters)}
                        >
                            <FormattedMessage id="client.bookings.newBooking" />
                        </Button>
                    </Box>
                    <DataLoadingContainer isLoading={isLoading} isError={isError} tryReload={refetch}>
                        <DataTable
                            columns={columns}
                            data={bookings}
                            totalCount={bookings.length}
                            page={page}
                            pageSize={pageSize}
                            onPageChange={setPage}
                            onPageSizeChange={(newPageSize) => { setPageSize(newPageSize); setPage(0); }}
                            isLoading={isLoading}
                            noDataMessage={formatMessage({id: "client.bookings.noBookings"})}
                            title={formatMessage({id: "client.bookings.listTitle"})}
                            // No toolbarActions needed here as the Add button is separate for this page
                        />
                    </DataLoadingContainer>
                </Container>
            </WebsiteLayout>

            <Modal open={isFormModalOpen} onClose={handleCloseFormModal}>
                <Paper sx={modalStyle}>
                    <BookingForm
                        isEdit={true} // Client is editing specific parts of an existing booking
                        initialData={editingBooking}
                        onSubmitSuccess={handleCloseFormModal}
                        userRole={UserRoleEnum.Client}
                        availablePets={petsData?.response || []} // Needed if form allows changing pet, otherwise optional
                        // availableSitters={sittersData?.response || []} // Not needed when client edits their own booking details
                    />
                </Paper>
            </Modal>

            <ConfirmationDialog
                isOpen={isConfirmDialogOpen}
                onClose={() => setIsConfirmDialogOpen(false)}
                onConfirm={confirmDelete}
                title={formatMessage({id: "labels.deleteBooking"})}
                message={formatMessage({id: "client.bookings.confirmDelete"}, { bookingInfo: bookingToDelete ? `${bookingToDelete.petName} with ${bookingToDelete.sitterName}` : ""})}
            />

            {detailBooking && (
                <BookingDetailDialog
                    booking={detailBooking}
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    userRole={UserRoleEnum.Client}
                    onEdit={handleOpenFormModal}
                    onDelete={handleDeleteClick}
                />
            )}
        </Fragment>
    );
};