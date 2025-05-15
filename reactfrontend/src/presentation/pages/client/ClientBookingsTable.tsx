import React, { Fragment, useState } from 'react'; // Removed useEffect as filtering moves to DataTable
import { WebsiteLayout } from "@presentation/layouts/WebsiteLayout";
import { Seo } from "@presentation/components/ui/Seo";
import { useIntl, FormattedMessage } from 'react-intl';
import { Container, Typography, Box, IconButton, Button, Modal, Paper, Tooltip, Chip } from '@mui/material'; // Removed TextField
import { useGetMyBookings, useDeleteBooking, useGetMyPets } from '@infrastructure/apis/api-management';
import { DataLoadingContainer } from '@presentation/components/ui/LoadingDisplay';
import { DataTable, DataTableColumn } from '@presentation/components/ui/Tables/DataTable/DataTable';
import { BookingDTO, BookingStatusEnum, UserRoleEnum } from '@infrastructure/apis/client';
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
// Removed useDebounce

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
            case BookingStatusEnum.Pending: return formatMessage({ id: "booking.status.pending" });
            case BookingStatusEnum.Accepted: return formatMessage({ id: "booking.status.accepted" });
            case BookingStatusEnum.Rejected: return formatMessage({ id: "booking.status.rejected" });
            case BookingStatusEnum.Completed: return formatMessage({ id: "booking.status.completed" });
            default: const exhaustiveCheck: never = status; return String(exhaustiveCheck);
        }
    };

    const columns: DataTableColumn<BookingDTO>[] = [
        { key: 'petName', name: formatMessage({ id: 'pet.name' }), render: (val, entry) => entry.petName || "N/A", searchable: true },
        { key: 'sitterName', name: formatMessage({ id: 'globals.sitter' }), render: (val, entry) => entry.sitterName || "N/A", searchable: true},
        { key: 'startDate', name: formatMessage({ id: 'booking.startDate' }), render: (value: Date) => dateToDatetimeString(new Date(value)) },
        { key: 'endDate', name: formatMessage({ id: 'booking.endDate' }), render: (value: Date) => dateToDatetimeString(new Date(value)) },
        {
            key: 'status',
            name: formatMessage({ id: 'booking.status' }),
            render: (value: BookingStatusEnum) => (
                <Chip label={getBookingStatusLabel(value)} color={getStatusChipColor(value)} size="small" />
            ),
            // searchable: true // To search by status text, you'd need a way for DataTable to use the rendered text
        },
        {
            key: 'notes', // Assuming notes might be searchable
            name: formatMessage({id: 'booking.notes'}),
            render: (value: string) => value && value.length > 30 ? `${value.substring(0,27)}...` : value,
            searchable: true
        },
        {
            key: 'actions_client_bookings',
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

    const allBookings = bookingsDataResponse?.response || [];

    return (
        <Fragment>
            <Seo title={formatMessage({ id: 'client.bookings.title' })} />
            <WebsiteLayout>
                <Container maxWidth="lg">
                    <DataLoadingContainer isLoading={isLoading} isError={isError} tryReload={refetch}>
                        <DataTable
                            columns={columns}
                            data={allBookings} // Pass full dataset
                            page={page}
                            pageSize={pageSize}
                            onPageChange={setPage}
                            onPageSizeChange={(newPageSize) => { setPageSize(newPageSize); setPage(0); }}
                            isLoading={isLoading}
                            noDataMessage={formatMessage({id: "client.bookings.noBookings"})}
                            title={formatMessage({id: "nav.myBookings"})}
                            toolbarActions={
                                <Button
                                    variant="contained"
                                    startIcon={<AddCircleOutlineIcon />}
                                    onClick={() => navigate(AppRoute.Sitters)}
                                >
                                    <FormattedMessage id="client.bookings.newBooking" />
                                </Button>
                            }
                            enableSearch={true}
                            searchPlaceholder={formatMessage({ id: 'client.bookings.searchPlaceholder' })}
                            serverSideOperations={false}
                        />
                    </DataLoadingContainer>
                </Container>
            </WebsiteLayout>

            <Modal open={isFormModalOpen} onClose={handleCloseFormModal}>
                <Paper sx={modalStyle}>
                    <BookingForm
                        isEdit={true}
                        initialData={editingBooking}
                        onSubmitSuccess={handleCloseFormModal}
                        userRole={UserRoleEnum.Client}
                        availablePets={petsData?.response || []}
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