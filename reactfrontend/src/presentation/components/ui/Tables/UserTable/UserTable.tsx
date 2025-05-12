import React from 'react'; // Added React import
import { useIntl, FormattedMessage } from "react-intl";
import { Box, IconButton, Tooltip, Chip } from "@mui/material"; // Removed TablePagination, isUndefined
import { DataLoadingContainer } from "../../LoadingDisplay";
import { useUserTableController } from "./UserTable.controller";
import { UserDTO, UserRoleEnum } from "@infrastructure/apis/client";
import DeleteIcon from '@mui/icons-material/Delete';
import { UserAddDialog } from "../../Dialogs/UserAddDialog";
import { useAppSelector } from "@application/store";
import { DataTable, DataTableColumn } from "@presentation/components/ui/Tables/DataTable/DataTable"; // Use new DataTable and types
import { toast } from 'react-toastify'; // For notifications

const getRoleChipColor = (role: UserRoleEnum): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" | undefined => {
    switch (role) {
        case UserRoleEnum.Admin: return "secondary";
        case UserRoleEnum.Sitter: return "info";
        case UserRoleEnum.Client: return "success";
        default: return "default";
    }
};

export const UserTable = () => {
    const { userId: ownUserId } = useAppSelector(x => x.profileReducer);
    const { formatMessage } = useIntl();
    const {
        page,
        pageSize,
        handlePageChange,
        handlePageSizeChange,
        pagedData,
        isError,
        isLoading,
        tryReload,
        removeUserMutation
    } = useUserTableController();

    const handleDelete = async (userId: string, userName: string) => {
        if (userId === ownUserId) {
            toast.error(formatMessage({ id: "admin.users.cannotDeleteSelf" }));
            return;
        }
        // Here you would typically open a confirmation dialog first
        // For brevity, directly calling delete. In a real app, use ConfirmationDialog.
        try {
            await removeUserMutation(userId);
            toast.success(formatMessage({ id: 'admin.users.deleteSuccess' }, { userName }));
            tryReload(); // Refetch data after deletion
        } catch (e: any) {
            const apiErrorMessage = e?.response?.data?.errorMessage?.message || e?.message;
            toast.error(apiErrorMessage || formatMessage({ id: 'error.defaultApi' }));
        }
    };

    const columns: DataTableColumn<UserDTO>[] = [
        { key: "name", name: formatMessage({ id: "globals.name" }) },
        { key: "email", name: formatMessage({ id: "globals.email" }) },
        { key: "phone", name: formatMessage({ id: "globals.phone" }) },
        {
            key: "role",
            name: formatMessage({ id: "globals.role" }),
            render: (value: UserRoleEnum) => (
                <Chip
                    label={formatMessage({ id: `globals.${value.toLowerCase()}` })}
                    color={getRoleChipColor(value)}
                    size="small"
                />
            )
        },
        {
            key: "actions",
            name: formatMessage({ id: "labels.actions" }),
            align: 'right',
            render: (_: any, entry: UserDTO) => ( // entry is UserDTO
                <Box>
                    <Tooltip title={formatMessage({ id: "labels.delete" })}>
                        <span> {/* Tooltip on disabled button requires a span wrapper */}
                            <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleDelete(entry.id, entry.name)}
                                disabled={entry.id === ownUserId}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                    {/* Add Edit button/dialog if needed */}
                </Box>
            )
        }
    ];

    const tableData = pagedData?.data || [];
    const totalRowCount = pagedData?.totalCount || 0;

    return (
        <DataLoadingContainer isError={isError} isLoading={isLoading} tryReload={tryReload}>
            {/* UserAddDialog can be placed outside DataTable or as a toolbarAction */}
            {/* <UserAddDialog /> */}
            <DataTable
                columns={columns}
                data={tableData}
                totalCount={totalRowCount}
                page={page}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                isLoading={isLoading}
                noDataMessage={formatMessage({id: "admin.users.noUsers"})}
                title={formatMessage({id: "admin.users.tableTitle"})} // i18n: admin.users.tableTitle
                toolbarActions={<UserAddDialog />} // Example of adding it to the toolbar
            />
        </DataLoadingContainer>
    );
};