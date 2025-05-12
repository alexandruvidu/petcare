import React from 'react';
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
    Typography
} from "@mui/material";
import { DataTableProps } from "./DataTable.types"; // Assuming DataTable.types.ts is similar to original

// Re-defining DataTableProps slightly to integrate pagination and optional title/actions
// Original DataTable.types.ts:
// export type DataTableHeader<T> = {
//     [TKey in keyof T]: {
//         key: TKey;
//         render?: (value: T[TKey], entry?: T) => React.JSX.Element;
//         name: string;
//         order: number
//     };
// }[keyof T][];
// export type DataTableExtraHeader<T> = {
//     key: string;
//     render: (entry: T) => React.JSX.Element;
//     name: string;
//     order: number
// }[];
// export type DataTableProps<T> = {
//     header: DataTableHeader<T>,
//     extraHeader?: DataTableExtraHeader<T>,
//     data: T[]
// }

// Enhanced DataTableProps for the new DataTable
export interface DataTableColumn<T> {
    key: keyof T | string; // Allow string for custom/action columns
    name: string;
    render?: (value: any, entry: T) => React.ReactNode;
    align?: 'left' | 'right' | 'center';
    width?: string | number;
}

export interface PaginatedDataTableProps<T extends { id?: string }> {
    columns: DataTableColumn<T>[];
    data: T[];
    totalCount: number;
    page: number; // 0-indexed for MUI TablePagination
    pageSize: number;
    onPageChange: (newPage: number) => void;
    onPageSizeChange: (newPageSize: number) => void;
    isLoading?: boolean;
    title?: string;
    toolbarActions?: React.ReactNode; // e.g., Add button
    noDataMessage?: string;
}


export function DataTable<T extends { id?: string }>(props: PaginatedDataTableProps<T>) {
    const {
        columns,
        data,
        totalCount,
        page,
        pageSize,
        onPageChange,
        onPageSizeChange,
        isLoading,
        title,
        toolbarActions,
        noDataMessage = "No data available"
    } = props;

    const handleChangePage = (_event: unknown, newPage: number) => {
        onPageChange(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        onPageSizeChange(parseInt(event.target.value, 10));
        onPageChange(0); // Reset to first page
    };

    return (
        <Paper sx={{ width: '100%', mb: 2, overflow: 'hidden' }}>
            {(title || toolbarActions) && (
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
                    {title && <Typography variant="h6">{title}</Typography>}
                    {toolbarActions && <Box>{toolbarActions}</Box>}
                </Box>
            )}
            <TableContainer>
                <Table stickyHeader aria-label={title || "data table"}>
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell key={String(col.key)} align={col.align || 'left'} style={{ width: col.width }}>
                                    {col.name}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                                    <Typography>Loading...</Typography> {/* Or use a CircularProgress */}
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                                    <Typography>{noDataMessage}</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row, rowIndex) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id || `row-${rowIndex}`}>
                                    {columns.map((col) => {
                                        const value = row[col.key as keyof T];
                                        return (
                                            <TableCell key={`${String(col.key)}-${row.id || rowIndex}`} align={col.align || 'left'}>
                                                {col.render ? col.render(value, row) : (value as React.ReactNode)}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalCount}
                rowsPerPage={pageSize}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}