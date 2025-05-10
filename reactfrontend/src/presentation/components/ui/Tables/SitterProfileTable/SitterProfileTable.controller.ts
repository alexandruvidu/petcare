"use client"

import type React from "react"

import { useTableController } from "../Table.controller"
import { useGetSitterProfiles, useDeleteSitterProfile } from "@infrastructure/apis/api-management/sitterProfile"
import { useQueryClient } from "@tanstack/react-query"
import { useCallback, useState } from "react"
import { usePaginationController } from "../Pagination.controller"
import { useDebounce } from "@infrastructure/hooks/useDebounce"

/**
 * This is controller hook manages the table state including the pagination and data retrieval from the backend.
 */
export const useSitterProfileTableController = () => {
  const queryClient = useQueryClient()
  const { page, pageSize, setPagination } = usePaginationController()
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)

  const { data, isError, isLoading, queryKey } = useGetSitterProfiles(page, pageSize, debouncedSearch)
  const { mutateAsync: remove } = useDeleteSitterProfile()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null)

  const tryReload = useCallback(() => queryClient.invalidateQueries({ queryKey: [queryKey] }), [queryClient, queryKey])

  const tableController = useTableController(setPagination, data?.response?.pageSize)

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }, [])

  const openDeleteDialog = useCallback((id: string) => {
    setProfileToDelete(id)
    setDeleteDialogOpen(true)
  }, [])

  const closeDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false)
    setProfileToDelete(null)
  }, [])

  const confirmDelete = useCallback(() => {
    if (profileToDelete) {
      remove(profileToDelete).then(() => {
        closeDeleteDialog()
      })
    }
  }, [profileToDelete, remove, closeDeleteDialog])

  return {
    ...tableController,
    tryReload,
    pagedData: data?.response,
    isError,
    isLoading,
    search,
    handleSearchChange,
    deleteDialogOpen,
    openDeleteDialog,
    closeDeleteDialog,
    confirmDelete,
  }
}
