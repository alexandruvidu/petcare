// Assuming this page is for Admin role to manage users
import React, { Fragment, useState } from 'react';
import { WebsiteLayout } from "@presentation/layouts/WebsiteLayout";
import { Seo } from "@presentation/components/ui/Seo";
import { useIntl, FormattedMessage } from 'react-intl';
import { Container, Typography, Box, IconButton, Tooltip, Chip, TextField } from '@mui/material'; // Removed Button, Modal, Paper
import { useGetUsers, useDeleteUser } from '@infrastructure/apis/api-management';
import { DataLoadingContainer } from '@presentation/components/ui/LoadingDisplay';
import { DataTable, DataTableColumn } from '@presentation/components/ui/Tables/DataTable/DataTable';
import { UserDTO, UserRoleEnum } from '@infrastructure/apis/client';
import DeleteIcon from '@mui/icons-material/Delete';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // Not needed if UserAddDialog is toolbarAction
// import { UserAddForm } from '@presentation/components/forms/User/UserAddForm'; // Form is in UserAddDialog
import { ConfirmationDialog } from '@presentation/components/ui/Dialogs/ConfirmationDialog';
import { toast } from 'react-toastify';
import useDebounce from '@infrastructure/hooks/useDebounce';
import { useAppSelector } from '@application/store';
import { UserAddDialog } from '@presentation/components/ui/Dialogs/UserAddDialog';

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

  // useGetUsers hook now takes debouncedSearchTerm for server-side filtering
  const { data: usersData, isLoading, isError, refetch } = useGetUsers(page + 1, pageSize, debouncedSearchTerm);
  const { mutateAsync: deleteUserMutation } = useDeleteUser();

  const [userToDelete, setUserToDelete] = useState<UserDTO | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

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
        refetch(); // Refetch data after deletion
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
      case UserRoleEnum.Admin: return formatMessage({ id: "globals.admin" });
      case UserRoleEnum.Client: return formatMessage({ id: "globals.client" });
      case UserRoleEnum.Sitter: return formatMessage({ id: "globals.sitter" });
      default: const exhaustiveCheck: never = role; return String(exhaustiveCheck);
    }
  };

  const columns: DataTableColumn<UserDTO>[] = [
    { key: 'name', name: formatMessage({ id: 'globals.name' }) },
    { key: 'email', name: formatMessage({ id: 'globals.email' }) },
    { key: 'phone', name: formatMessage({ id: 'globals.phone' }) },
    {
      key: 'role',
      name: formatMessage({ id: 'globals.role' }),
      render: (value: UserRoleEnum) => ( <Chip label={getRoleLabel(value)} color={getRoleChipColor(value)} size="small" /> )
    },
    {
      key: 'actions_col',
      name: formatMessage({ id: 'labels.actions' }),
      align: 'right',
      render: (_: any, entry: UserDTO) => (
          <Box>
            <Tooltip title={formatMessage({id: "labels.delete"})}>
                <span>
                    <IconButton onClick={() => handleDeleteClick(entry)} color="error" disabled={entry.id === ownUserId} size="small" >
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
            {/* Search TextField remains here as it drives server-side filtering */}
            <TextField
                fullWidth
                variant="outlined"
                placeholder={formatMessage({ id: 'admin.users.searchPlaceholder' })}
                value={searchTerm}
                onChange={(e) => {setSearchTerm(e.target.value); setPage(0);}} // Reset page on new search
                sx={{ mb: 2, mt:1 }} // Added mt:1
            />
            <DataLoadingContainer isLoading={isLoading} isError={isError} tryReload={refetch}>
              <DataTable
                  columns={columns}
                  data={tableData} // Data is already filtered/paginated by server
                  totalCount={totalCount}
                  page={page}
                  pageSize={pageSize}
                  onPageChange={setPage} // Parent controls pagination
                  onPageSizeChange={(newPageSize) => {setPageSize(newPageSize); setPage(0);}}
                  isLoading={isLoading}
                  noDataMessage={formatMessage({id: "admin.users.noUsers"})}
                  title={formatMessage({id: "admin.users.header"})} // Changed title to header
                  toolbarActions={<UserAddDialog />}
                  enableSearch={false} // Explicitly disable internal search for UsersPage
                  serverSideOperations={true} // Indicate that parent handles operations
              />
            </DataLoadingContainer>
          </Container>
        </WebsiteLayout>

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