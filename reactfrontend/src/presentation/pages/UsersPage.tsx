// Assuming this page is for Admin role to manage users
import React, { Fragment, useState } from 'react';
import { WebsiteLayout } from "@presentation/layouts/WebsiteLayout";
import { Seo } from "@presentation/components/ui/Seo";
import { useIntl, FormattedMessage } from 'react-intl';
import { Container, Typography, Box, IconButton, Button, Modal, Paper, Tooltip, Chip, TextField } from '@mui/material';
import { useGetUsers, useDeleteUser } from '@infrastructure/apis/api-management';
import { DataLoadingContainer } from '@presentation/components/ui/LoadingDisplay';
import { DataTable, DataTableColumn } from '@presentation/components/ui/Tables/DataTable/DataTable';
import { UserDTO, UserRoleEnum } from '@infrastructure/apis/client';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { UserAddForm } from '@presentation/components/forms/User/UserAddForm';
import { ConfirmationDialog } from '@presentation/components/ui/Dialogs/ConfirmationDialog';
import { toast } from 'react-toastify';
import useDebounce from '@infrastructure/hooks/useDebounce';
import { useAppSelector } from '@application/store';
import { UserAddDialog } from '@presentation/components/ui/Dialogs/UserAddDialog'; // Ensured this is imported if used directly

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500 },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const getRoleChipColor = (role: UserRoleEnum): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" | undefined => {
  switch (role) {
    case UserRoleEnum.Admin: return "secondary";
    case UserRoleEnum.Sitter: return "info";
    case UserRoleEnum.Client: return "success";
    default: return "default";
  }
};

export const UsersPage: React.FC = () => {
  const { formatMessage } = useIntl();
  const { userId: ownUserId } = useAppSelector(x => x.profileReducer);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: usersData, isLoading, isError, refetch } = useGetUsers(page + 1, pageSize, debouncedSearchTerm);
  const { mutateAsync: deleteUserMutation } = useDeleteUser();

  // const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false); // Managed by UserAddDialog
  const [userToDelete, setUserToDelete] = useState<UserDTO | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // const handleOpenAddUserModal = () => setIsAddUserModalOpen(true); // Managed by UserAddDialog
  // const handleCloseAddUserModal = () => {                         // Managed by UserAddDialog
  //   setIsAddUserModalOpen(false);
  //   refetch();
  // };

  const handleDeleteClick = (user: UserDTO) => {
    if (user.id === ownUserId) {
      toast.error(formatMessage({id: "admin.users.cannotDeleteSelf"}));
      return;
    }
    setUserToDelete(user);
    setIsConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUserMutation(userToDelete.id);
        toast.success(formatMessage({ id: 'admin.users.deleteSuccess' }, {userName: userToDelete.name}));
        refetch();
      } catch (e: any) {
        const apiErrorMessage = e?.response?.data?.errorMessage?.message || e?.message;
        toast.error(apiErrorMessage || formatMessage({ id: 'error.defaultApi' }));
      }
    }
    setIsConfirmDialogOpen(false);
    setUserToDelete(null);
  };

  const getRoleLabel = (role: UserRoleEnum): string => {
    switch (role) {
      case UserRoleEnum.Admin:
        return formatMessage({ id: "globals.admin" });
      case UserRoleEnum.Client:
        return formatMessage({ id: "globals.client" });
      case UserRoleEnum.Sitter:
        return formatMessage({ id: "globals.sitter" });
      default:
        // This should ideally not be reached if 'role' is always a valid UserRoleEnum
        // Adding a more explicit fallback for safety.
        const exhaustiveCheck: never = role;
        return String(exhaustiveCheck);
    }
  };

  const columns: DataTableColumn<UserDTO>[] = [
    {
      key: 'name',
      name: formatMessage({ id: 'globals.name' })
    },
    {
      key: 'email',
      name: formatMessage({ id: 'globals.email' })
    },
    {
      key: 'phone',
      name: formatMessage({ id: 'globals.phone' })
    },
    {
      key: 'role',
      name: formatMessage({ id: 'globals.role' }),
      render: (value: UserRoleEnum) => (
          <Chip
              label={getRoleLabel(value)}
              color={getRoleChipColor(value)}
              size="small"
          />
      )
    },
    {
      key: 'actions_col', // Ensure custom keys for non-data properties are distinct
      name: formatMessage({ id: 'labels.actions' }),
      align: 'right',
      render: (_: any, entry: UserDTO) => ( // _ refers to the value for 'actions_col', which is undefined
          <Box>
            <Tooltip title={formatMessage({id: "labels.delete"})}>
                <span>
                    <IconButton
                        onClick={() => handleDeleteClick(entry)}
                        color="error"
                        disabled={entry.id === ownUserId}
                        size="small"
                    >
                        <DeleteIcon fontSize="small"/>
                    </IconButton>
                </span>
            </Tooltip>
          </Box>
      )
    }
  ];

  const totalCount = usersData?.response?.totalCount || 0;
  const tableData = usersData?.response?.data || [];

  return (
      <Fragment>
        <Seo title={formatMessage({ id: 'admin.users.title' })} />
        <WebsiteLayout>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" component="h1">
                <FormattedMessage id="admin.users.header" />
              </Typography>
              {/* UserAddDialog already contains its own Button to open the modal */}
              {/* <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={handleOpenAddUserModal} // This is now managed by UserAddDialog
              >
                <FormattedMessage id="admin.users.addUser" />
              </Button> */}
            </Box>
            <TextField
                fullWidth
                variant="outlined"
                placeholder={formatMessage({ id: 'admin.users.searchPlaceholder' })}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
            />
            <DataLoadingContainer isLoading={isLoading} isError={isError} tryReload={refetch}>
              <DataTable
                  columns={columns}
                  data={tableData}
                  totalCount={totalCount}
                  page={page}
                  pageSize={pageSize}
                  onPageChange={setPage}
                  onPageSizeChange={(newPageSize) => {setPageSize(newPageSize); setPage(0);}}
                  isLoading={isLoading}
                  noDataMessage={formatMessage({id: "admin.users.noUsers"})}
                  title={formatMessage({id: "admin.users.tableTitle"})}
                  toolbarActions={<UserAddDialog />}
              />
            </DataLoadingContainer>
          </Container>
        </WebsiteLayout>

        {/* Modal for adding user is now handled by UserAddDialog component directly */}
        {/* <Modal open={isAddUserModalOpen} onClose={handleCloseAddUserModal}>
          <Paper sx={modalStyle}>
            <UserAddForm onSubmit={handleCloseAddUserModal} />
          </Paper>
        </Modal> */}

        <ConfirmationDialog
            isOpen={isConfirmDialogOpen}
            onClose={() => setIsConfirmDialogOpen(false)}
            onConfirm={confirmDelete}
            title={formatMessage({id: "labels.deleteUser"})}
            message={formatMessage({id: "admin.users.confirmDeleteUser"}, { userName: userToDelete?.name || ""})}
        />
      </Fragment>
  );
};