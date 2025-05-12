import { useGetUsers, useDeleteUser } from "@infrastructure/apis/api-management";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react"; // Added useState for local pagination control

/**
 * This is controller hook manages the table state including the pagination and data retrieval from the backend.
 */
export const useUserTableController = () => {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(0); // 0-indexed for MUI TablePagination
    const [pageSize, setPageSize] = useState(10);
    // Search term can be added here if needed for UserTable
    // const [searchTerm, setSearchTerm] = useState("");
    // const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // API uses 1-indexed page
    const { data: usersDataResponse, isError, isLoading, queryKey: usersQueryKey } = useGetUsers(page + 1, pageSize /*, debouncedSearchTerm */);
    const { mutateAsync: removeUserMutation } = useDeleteUser();

    const tryReload = useCallback(
        () => queryClient.invalidateQueries({ queryKey: [usersQueryKey] }),
        [queryClient, usersQueryKey]);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);

    const handlePageSizeChange = useCallback((newPageSize: number) => {
        setPageSize(newPageSize);
        setPage(0); // Reset to first page
    }, []);

    return {
        page,
        pageSize,
        handlePageChange,
        handlePageSizeChange,
        tryReload,
        pagedData: usersDataResponse?.response, // This is PagedResponse<UserDTO>
        isError,
        isLoading,
        removeUserMutation // Expose the mutation function itself
    };
}