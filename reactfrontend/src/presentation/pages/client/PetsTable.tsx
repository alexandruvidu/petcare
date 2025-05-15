import React, { Fragment, useState } from 'react';
import { WebsiteLayout } from "@presentation/layouts/WebsiteLayout";
import { Seo } from "@presentation/components/ui/Seo";
import { useIntl, FormattedMessage } from 'react-intl';
import { Container, Typography, Box, IconButton, Button, Modal, Paper, Tooltip } from '@mui/material'; // Removed TextField
import { useGetMyPets, useDeletePet } from '@infrastructure/apis/api-management/pet';
import { DataLoadingContainer } from '@presentation/components/ui/LoadingDisplay';
import { DataTable, DataTableColumn } from '@presentation/components/ui/Tables/DataTable/DataTable';
import { PetDTO } from '@infrastructure/apis/client';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { PetForm } from '@presentation/components/forms/Pet/PetForm';
import { ConfirmationDialog } from '@presentation/components/ui/Dialogs/ConfirmationDialog';
import { toast } from 'react-toastify';
// Removed useDebounce as DataTable handles its own debouncing if necessary (not implemented in this pass for DataTable internal)

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 450, md: 500 },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

export const PetsTable: React.FC = () => {
    const { formatMessage } = useIntl();
    const { data: petsDataResponse, isLoading, isError, refetch } = useGetMyPets();
    const { mutateAsync: deletePetMutation } = useDeletePet();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPet, setEditingPet] = useState<PetDTO | undefined>(undefined);
    const [petToDelete, setPetToDelete] = useState<PetDTO | null>(null);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const handleOpenModal = (pet?: PetDTO) => {
        setEditingPet(pet);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPet(undefined);
        refetch();
    };

    const handleDeleteClick = (pet: PetDTO) => {
        setPetToDelete(pet);
        setIsConfirmDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (petToDelete) {
            try {
                await deletePetMutation(petToDelete.id);
                toast.success(formatMessage({ id: 'success.petDeleted' }));
                refetch();
            } catch (e: any) {
                const apiErrorMessage = e?.response?.data?.errorMessage?.message || e?.message;
                toast.error(apiErrorMessage || formatMessage({ id: 'error.defaultApi' }));
            }
        }
        setIsConfirmDialogOpen(false);
        setPetToDelete(null);
    };

    const columns: DataTableColumn<PetDTO>[] = [
        { key: 'name', name: formatMessage({ id: 'pet.name' }), searchable: true },
        { key: 'type', name: formatMessage({ id: 'pet.type' }), searchable: true },
        { key: 'breed', name: formatMessage({ id: 'pet.breed' }), searchable: true },
        {
            key: 'age',
            name: formatMessage({ id: 'pet.age' }),
            render: (value: number) => `${value} ${value === 1 ? formatMessage({ id: 'pet.year' }) : formatMessage({ id: 'pet.years' })}`,
            searchable: false // Age might not be ideal for free text search
        },
        {
            key: 'actions',
            name: formatMessage({ id: "labels.actions" }),
            align: 'right',
            render: (_, entry) => (
                <Box>
                    <Tooltip title={formatMessage({id: "labels.editPet"})}>
                        <IconButton onClick={() => handleOpenModal(entry)} color="primary" size="small">
                            <EditIcon fontSize="small"/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={formatMessage({id: "labels.deletePet"})}>
                        <IconButton onClick={() => handleDeleteClick(entry)} color="error" size="small">
                            <DeleteIcon fontSize="small"/>
                        </IconButton>
                    </Tooltip>
                </Box>
            )
        }
    ];

    const allPets = petsDataResponse?.response || [];

    return (
        <Fragment>
            <Seo title={formatMessage({ id: 'client.pets.title' })} />
            <WebsiteLayout>
                <Container maxWidth="lg">
                    {/* Add button is now a toolbarAction for DataTable */}
                    <DataLoadingContainer isLoading={isLoading} isError={isError} tryReload={refetch}>
                        <DataTable
                            columns={columns}
                            data={allPets} // Pass full dataset
                            page={page} // Parent still controls page for its state
                            pageSize={pageSize} // Parent still controls pageSize for its state
                            onPageChange={setPage}
                            onPageSizeChange={(newPageSize) => {setPageSize(newPageSize); setPage(0);}}
                            isLoading={isLoading}
                            noDataMessage={formatMessage({id: 'client.pets.noPets'})}
                            title={formatMessage({ id: 'nav.myPets' })}
                            toolbarActions={
                                <Button
                                    variant="contained"
                                    startIcon={<AddCircleOutlineIcon />}
                                    onClick={() => handleOpenModal()}
                                >
                                    {formatMessage({ id: 'labels.addPet' })}
                                </Button>
                            }
                            enableSearch={true}
                            searchPlaceholder={formatMessage({ id: 'client.pets.searchPlaceholder' })}
                            serverSideOperations={false} // Crucial: DataTable will do client-side filtering
                        />
                    </DataLoadingContainer>
                </Container>
            </WebsiteLayout>
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="pet-form-modal-title"
            >
                <Paper sx={modalStyle}>
                    <PetForm initialData={editingPet} onSubmitSuccess={handleCloseModal} />
                </Paper>
            </Modal>
            <ConfirmationDialog
                isOpen={isConfirmDialogOpen}
                onClose={() => setIsConfirmDialogOpen(false)}
                onConfirm={confirmDelete}
                title={formatMessage({id: "labels.deletePet"})}
                message={formatMessage({id: "client.pets.confirmDelete"}, { petName: petToDelete?.name || ""})}
            />
        </Fragment>
    );
};