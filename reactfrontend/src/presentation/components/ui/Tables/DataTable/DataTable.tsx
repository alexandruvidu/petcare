import React, { useState, useEffect, useMemo } from 'react'; // Added useState, useEffect, useMemo
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Box,
    Typography,
    TextField, // Added TextField for search
    InputAdornment // For search icon
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search'; // Search Icon
import useDebounce from '@infrastructure/hooks/useDebounce'; // For debouncing search
import { useIntl } from 'react-intl'; // For default placeholder

// Enhanced DataTableProps for the new DataTable
export interface DataTableColumn<T> {
    key: keyof T | string;
    name: string;
    render?: (value: any, entry: T) => React.ReactNode;
    align?: 'left' | 'right' | 'center';
    width?: string | number;
    searchable?: boolean; // New: Mark column as searchable
}

export interface PaginatedDataTableProps<T extends { id?: string }> {
    columns: DataTableColumn<T>[];
    data: T[]; // This should be the full, unfiltered dataset if DataTable handles search
    totalCount?: number; // If pagination is server-side and data is already paginated, this is parent's total.
                         // If DataTable handles client-side pagination/search, this can be omitted or will be data.length.
    page: number;
    pageSize: number;
    onPageChange: (newPage: number) => void;
    onPageSizeChange: (newPageSize: number) => void;
    isLoading?: boolean;
    title?: string;
    toolbarActions?: React.ReactNode;
    noDataMessage?: string;
    enableSearch?: boolean; // New: To enable/disable internal search bar
    searchPlaceholder?: string; // New: Placeholder for search bar
    // If true, DataTable assumes `data` is already filtered/paginated by parent, and `totalCount` is accurate for that.
    // If false (default), DataTable will perform client-side filtering/pagination on the passed `data`.
    serverSideOperations?: boolean;
}


export function DataTable<T extends { id?: string }>(props: PaginatedDataTableProps<T>) {
    const {
        columns,
        data: initialData, // Rename to initialData to avoid confusion with internal filteredData
        totalCount: parentTotalCount,
        page: parentPage,
        pageSize: parentPageSize,
        onPageChange: parentOnPageChange,
        onPageSizeChange: parentOnPageSizeChange,
        isLoading,
        title,
        toolbarActions,
        noDataMessage = "No data available",
        enableSearch = false,
        searchPlaceholder,
        serverSideOperations = false, // Default to client-side filtering/pagination
    } = props;

    const { formatMessage } = useIntl();
    const [internalSearchTerm, setInternalSearchTerm] = useState("");
    const debouncedInternalSearchTerm = useDebounce(internalSearchTerm, 300);

    const searchableColumns = useMemo(() => columns.filter(col => col.searchable), [columns]);

    const filteredData = useMemo(() => {
        if (serverSideOperations || !enableSearch || !debouncedInternalSearchTerm || searchableColumns.length === 0) {
            return initialData;
        }
        const lowerSearchTerm = debouncedInternalSearchTerm.toLowerCase();
        return initialData.filter(row =>
            searchableColumns.some(col => {
                const value = row[col.key as keyof T];
                if (value === null || value === undefined) return false;
                // If a custom render function exists, it's hard to search generically.
                // We'll search the raw value. For more complex cases, custom search logic might be needed.
                return String(value).toLowerCase().includes(lowerSearchTerm);
            })
        );
    }, [initialData, debouncedInternalSearchTerm, enableSearch, searchableColumns, serverSideOperations]);

    // Client-side pagination state if not server-side operations
    const [clientPage, setClientPage] = useState(0);
    const [clientPageSize, setClientPageSize] = useState(parentPageSize || 10);

    useEffect(() => {
        if (!serverSideOperations) {
            setClientPage(0); // Reset to first page when data or search term changes
        }
    }, [filteredData, serverSideOperations]);

    useEffect(() => { // Sync parent PageSize with client PageSize if not server-side
        if(!serverSideOperations) {
            setClientPageSize(parentPageSize)
        }
    }, [parentPageSize, serverSideOperations])


    const displayData = serverSideOperations
        ? initialData // Parent handles pagination and filtering
        : filteredData.slice(clientPage * clientPageSize, clientPage * clientPageSize + clientPageSize);

    const currentTotalCount = serverSideOperations ? (parentTotalCount ?? initialData.length) : filteredData.length;
    const currentPage = serverSideOperations ? parentPage : clientPage;
    const currentPageSize = serverSideOperations ? parentPageSize : clientPageSize;

    const handleChangePage = (_event: unknown, newPage: number) => {
        if (serverSideOperations) {
            parentOnPageChange(newPage);
        } else {
            setClientPage(newPage);
            parentOnPageChange(newPage); // Notify parent for potential state consistency if needed
        }
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPageSize = parseInt(event.target.value, 10);
        if (serverSideOperations) {
            parentOnPageSizeChange(newPageSize);
            parentOnPageChange(0); // Reset to first page often desired
        } else {
            setClientPageSize(newPageSize);
            setClientPage(0);
            parentOnPageSizeChange(newPageSize); // Notify parent
            parentOnPageChange(0);
        }
    };

    const defaultSearchPlaceholder = formatMessage({ id: "labels.search" }); // Add labels.search to your i18n files

    return (
        <Paper sx={{ width: '100%', mb: 2, overflow: 'hidden' }}>
            <Box
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' }, // Stack on small screens
                    justifyContent: 'space-between',
                    alignItems: {sm: 'center'}, // Align center for larger screens
                    gap: 2, // Gap between items
                    borderBottom: 1,
                    borderColor: 'divider'
                }}
            >
                {title && <Typography variant="h6" sx={{flexShrink: 0}}>{title}</Typography>}
                {enableSearch && !serverSideOperations && (
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder={searchPlaceholder || defaultSearchPlaceholder}
                        value={internalSearchTerm}
                        onChange={(e) => setInternalSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ maxWidth: { xs: '100%', sm: 300 }, width: '100%' }} // Responsive width
                    />
                )}
                {toolbarActions && <Box sx={{flexShrink: 0}}>{toolbarActions}</Box>}
            </Box>
            <TableContainer>
                <Table stickyHeader aria-label={title || "data table"}>
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell key={String(col.key)} align={col.align || 'left'} style={{ width: col.width, fontWeight: 'bold' }}>
                                    {col.name}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                                    <Typography>Loading...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : displayData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                                    <Typography>{noDataMessage}</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            displayData.map((row, rowIndex) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id || `row-${rowIndex}`}>
                                    {columns.map((col) => {
                                        const value = row[col.key as keyof T];
                                        return (
                                            <TableCell key={`${String(col.key)}-${row.id || rowIndex}`} align={col.align || 'left'}>
                                                {col.render ? col.render(value, row) : (value as React.ReactNode ?? '')}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {currentTotalCount > 0 && ( // Only show pagination if there's data
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={currentTotalCount}
                    rowsPerPage={currentPageSize}
                    page={currentPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            )}
        </Paper>
    );
}