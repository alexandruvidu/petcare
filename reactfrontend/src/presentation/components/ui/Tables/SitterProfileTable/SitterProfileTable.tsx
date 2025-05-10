"use client"

import { useIntl } from "react-intl"
import { isUndefined } from "lodash"
import {
  IconButton,
  TablePagination,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material"
import { DataLoadingContainer } from "../../LoadingDisplay"
import { useSitterProfileTableController } from "./SitterProfileTable.controller"
import type { SitterProfileDTO } from "@infrastructure/apis/client"
import DeleteIcon from "@mui/icons-material/Delete"
import { DataTable, type DataTableHeader } from "@presentation/components/ui/Tables/DataTable"

/**
 * This hook returns a header for the table with translated columns.
 */
const useHeader = (): DataTableHeader<SitterProfileDTO> => {
  const { formatMessage } = useIntl()

  return [
    {
      key: "user",
      name: formatMessage({ id: "globals.name" }),
      order: 1,
      render: (value) => <span>{value?.name}</span>,
    },
    { key: "description", name: formatMessage({ id: "globals.description" }), order: 2 },
    { key: "rate", name: formatMessage({ id: "globals.rate" }), order: 3 },
    { key: "experience", name: formatMessage({ id: "globals.experience" }), order: 4 },
  ]
}

/**
 * Creates the sitter profile table.
 */
export const SitterProfileTable = () => {
  const { formatMessage } = useIntl()
  const header = useHeader()

  const {
    handleChangePage,
    handleChangePageSize,
    pagedData,
    isError,
    isLoading,
    tryReload,
    labelDisplay,
    search,
    handleSearchChange,
    deleteDialogOpen,
    openDeleteDialog,
    closeDeleteDialog,
    confirmDelete,
  } = useSitterProfileTableController()

  return (
    <DataLoadingContainer isError={isError} isLoading={isLoading} tryReload={tryReload}>
      <div className="flex justify-between items-center mb-4">
        <TextField
          label={formatMessage({ id: "globals.search" })}
          variant="outlined"
          size="small"
          value={search}
          onChange={handleSearchChange}
          placeholder={formatMessage({ id: "globals.placeholders.search" })}
          className="w-1/3"
        />
      </div>

      {!isUndefined(pagedData) &&
        !isUndefined(pagedData?.totalCount) &&
        !isUndefined(pagedData?.page) &&
        !isUndefined(pagedData?.pageSize) && (
          <TablePagination
            component="div"
            count={pagedData.totalCount}
            page={pagedData.totalCount !== 0 ? pagedData.page - 1 : 0}
            onPageChange={handleChangePage}
            rowsPerPage={pagedData.pageSize}
            onRowsPerPageChange={handleChangePageSize}
            labelRowsPerPage={formatMessage({ id: "labels.itemsPerPage" })}
            labelDisplayedRows={labelDisplay}
            showFirstButton
            showLastButton
          />
        )}

      <DataTable
        data={pagedData?.data ?? []}
        header={header}
        extraHeader={[
          {
            key: "actions",
            name: formatMessage({ id: "labels.actions" }),
            render: (entry) => (
              <>
                <IconButton color="error" onClick={() => openDeleteDialog(entry.id || "")}>
                  <DeleteIcon color="error" fontSize="small" />
                </IconButton>
              </>
            ),
            order: 5,
          },
        ]}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{formatMessage({ id: "globals.confirmations.deleteTitle" })}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {formatMessage({ id: "globals.confirmations.deleteMessage" })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            {formatMessage({ id: "globals.cancel" })}
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            {formatMessage({ id: "globals.delete" })}
          </Button>
        </DialogActions>
      </Dialog>
    </DataLoadingContainer>
  )
}
