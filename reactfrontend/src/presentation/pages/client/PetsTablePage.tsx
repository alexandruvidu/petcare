import React, { useState } from 'react';
import {
  Typography,
  Paper,
  Button,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useGetMyPets, useDeletePet } from '@infrastructure/apis/api-management';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { PetFormDialog } from '@presentation/components/ui/Dialogs/PetFormDialog/PetFormDialog';
import { ConfirmationDialog } from '@presentation/components/ui/ConfirmationDialog/ConfirmationDialog';

export const PetsTablePage = () => {
  const { data: pets, isLoading, isError } = useGetMyPets();
  const { mutate: deletePet, isLoading: isDeleting } = useDeletePet();
  
  const [openPetDialog, setOpenPetDialog] = useState(false);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [petToDelete, setPetToDelete] = useState<string | null>(null);

  const handleAddPet = () => {
    setSelectedPet(null);
    setOpenPetDialog(true);
  };

  const handleEditPet = (pet: any) => {
    setSelectedPet(pet);
    setOpenPetDialog(true);
  };

  const handleDeletePet = (petId: string) => {
    setPetToDelete(petId);
    setOpenConfirmDialog(true);
  };

  const confirmDelete = () => {
    if (petToDelete) {
      deletePet(petToDelete, {
        onSuccess: () => {
          setOpenConfirmDialog(false);
          setPetToDelete(null);
        }
      });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        <FormattedMessage id="errors.fetchFailed" defaultMessage="Failed to load pets. Please try again later." />
      </Alert>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          <FormattedMessage id="pages.pets.title" defaultMessage="My Pets" />
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddPet}
        >
          <FormattedMessage id="pages.pets.addPet" defaultMessage="Add Pet" />
        </Button>
      </Box>

      {(!pets || pets.length === 0) ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <FormattedMessage id="pages.pets.noPets" defaultMessage="You don't have any pets registered yet." />
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddPet}
          >
            <FormattedMessage id="pages.pets.addYourFirstPet" defaultMessage="Add Your First Pet" />
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <FormattedMessage id="forms.fields.name" defaultMessage="Name" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="forms.fields.petType" defaultMessage="Type" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="forms.fields.breed" defaultMessage="Breed" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="forms.fields.age" defaultMessage="Age" />
                </TableCell>
                <TableCell align="right">
                  <FormattedMessage id="tables.actions" defaultMessage="Actions" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pets.map((pet: any) => (
                <TableRow key={pet.id}>
                  <TableCell>{pet.name}</TableCell>
                  <TableCell>{pet.type}</TableCell>
                  <TableCell>{pet.breed}</TableCell>
                  <TableCell>
                    {pet.age} {pet.age === 1 ? 
                      <FormattedMessage id="age.year" defaultMessage="year" /> : 
                      <FormattedMessage id="age.years" defaultMessage="years" />
                    }
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      color="primary" 
                      onClick={() => handleEditPet(pet)}
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeletePet(pet.id)}
                      aria-label="delete"
                      disabled={isDeleting}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pet Form Dialog */}
      <PetFormDialog
        open={openPetDialog}
        onClose={() => setOpenPetDialog(false)}
        pet={selectedPet}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={openConfirmDialog}
        title={<FormattedMessage id="dialogs.pet.deleteTitle" defaultMessage="Delete Pet" />}
        message={<FormattedMessage 
          id="dialogs.pet.deleteMessage" 
          defaultMessage="Are you sure you want to delete this pet? This action cannot be undone."
        />}
        onConfirm={confirmDelete}
        onCancel={() => {
          setOpenConfirmDialog(false);
          setPetToDelete(null);
        }}
      />
    </>
  );
};