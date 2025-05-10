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
import { usePetTableController } from "./PetTable.controller"
import type { PetDTO } from "@infrastructure/apis/client"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import { PetAddDialog } from "../../Dialogs/PetAddDialog"
import { PetEditDialog } from "../../Dialogs/PetEditDialog"
import { DataTable, type DataTableHeader } from "@presentation/components/ui/Tables/DataTable"
import { useState } from "react"

/**
 * This hook returns a header for the table with translated columns.
 */
const useHeader = (): DataTableHeader<PetDTO> => {
  const { formatMessage } = useIntl()

  return [
    { key: "name", name: formatMessage({ id: "globals.name" }), order: 1 },
    { key: "type", name: formatMessage({ id: "globals.type" }), order: 2 },
    { key: "breed", name: formatMessage({ id: "globals.breed" }), order: 3 },
    { key: "age", name: formatMessage({ id: "globals.age" }), order: 4 },
    { key: "description", name: formatMessage({ id: "globals.description" }), order: 5 },
  ]
}

/**
 * Creates the pet table.
 */
export const PetTable = () => {
  const { formatMessage } = useIntl()
  const header = useHeader()
  const [editPetId, setEditPetId] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

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
  } = usePetTableController()

  const handleEditClick = (id: string) => {
    setEditPetId(id)
    setEditDialogOpen(true)
  }

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false)
    setEditPetId(null)
  }

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
        <PetAddDialog />
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
                <IconButton color="primary" onClick={() => handleEditClick(entry.id || "")}>
                  <EditIcon color="primary" fontSize="small" />
                </IconButton>
                <IconButton color="error" onClick={() => openDeleteDialog(entry.id || "")}>
                  <DeleteIcon color="error" fontSize="small" />
                </IconButton>
              </>
            ),
            order: 6,
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

      {/* Edit Dialog */}
      {editPetId && <PetEditDialog open={editDialogOpen} onClose={handleCloseEditDialog} petId={editPetId} />}
    </DataLoadingContainer>
  )
}
