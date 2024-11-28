import React, { useState, useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnResizeMode,
  createColumnHelper,
  PaginationState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Columns3, EllipsisVertical } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import TableSettingPopover from '@/pages/master/components/TableSettings';

// API Request and Response Types
interface SortConfig {
  key: string;
  order: 'ASC' | 'DESC';
}
interface ColumnDefinition<T> {
  accessorKey: string;
  header: string;
  size?: number;
  cell?: (info: any) => React.ReactNode;
  initiallyVisible?: boolean; // New optional property
}
interface FilterConfig {
  key: string;
  operator: string;
  field_type: string;
  value: string;
}

export interface TableRequestParams {
  pageNo: number;
  pageSize: number;
  sort?: SortConfig[];
  filters?: FilterConfig[];
}

// Table Component Props
interface AdvancedTableProps<T> {
  columns: Array<{
    accessorKey: string;
    header: string;
    size?: number;
    cell?: (info: any) => React.ReactNode;
  }>;
  data: T[];
  totalCount: number;
  requestParams: TableRequestParams;
  onRequestParamsChange?: (params: TableRequestParams) => void;
  width?: string;
  maxW?: string;
  height?: string;
  maxH?: string;
}

function AdvancedTable<T>({
  columns,
  data,
  totalCount,
  requestParams,
  onRequestParamsChange,
  width = '100',
  height = '25',
  maxW = '300',
  maxH = 'auto'
}: AdvancedTableProps<T>) {
  // State management
  const [columnVisibility, setColumnVisibility] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: requestParams.pageNo - 1,
    pageSize: requestParams.pageSize,
  });
  const [tableSettings, setTableSettings] = useState({
    pageSize: pagination.pageSize,
    totalPages: totalCount,
    width: width,
    maxWidth: maxW,
    height: height,
    maxHeight: maxH,
  });

  const updateTableSettings = (updatedSettings: any) => {
    setTableSettings(updatedSettings);
  };

  // Handle pagination and parameter changes
  const handlePaginationChange = (updaterOrValue: PaginationState | ((oldState: PaginationState) => PaginationState)) => {
    const newPagination = typeof updaterOrValue === 'function'
      ? updaterOrValue(pagination)
      : updaterOrValue;

    setPagination(newPagination);

    if (onRequestParamsChange) {
      const newParams: TableRequestParams = {
        ...requestParams,
        pageNo: newPagination.pageIndex + 1,
        pageSize: newPagination.pageSize,
      };

      onRequestParamsChange(newParams); // Update the parent with new params
    }
  };

  // Create column helper for type-safe column definitions
  const columnHelper = createColumnHelper<T>();

  // Prepare table columns
  const tableColumns = useMemo(() =>
    columns.map(col =>
      columnHelper.accessor(col.accessorKey as any, {
        header: col.header,
        size: col.size ?? 150,
        cell: col.cell ?? (info => info.getValue()),
      })
    ),
    [columns]
  );

  // Table instance with Tanstack
  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode: 'onChange' as ColumnResizeMode,
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    state: {
      columnVisibility,
      pagination,
    },
    onPaginationChange: handlePaginationChange,
    onColumnVisibilityChange: setColumnVisibility,
  });
  const columnHeaders = table.getAllLeafColumns();


  // Column visibility toggle component
  // const ColumnVisibilityToggle = () => (
  //   <Dialog>
  //     <DialogTrigger asChild>
  //       <Button variant="outline" size="icon">
  //         <Columns3 className="h-4 w-4" />
  //       </Button>
  //     </DialogTrigger>
  //     <DialogContent>
  //       <DialogHeader>
  //         <DialogTitle>Toggle Columns</DialogTitle>
  //       </DialogHeader>
  //       <div className="grid gap-4">
  //         {JSON.stringify(table.getAllLeafColumns())}
  //         {table.getAllLeafColumns().map(column => (
  //           <div key={column.id} className="flex items-center space-x-2">
  //             <Checkbox
  //               checked={column.getIsVisible()}
  //               onCheckedChange={(value) => column.toggleVisibility(!!value)}
  //               id={`column-${column.id}`}
  //             />
  //             <label
  //               htmlFor={`column-${column.id}`}
  //               className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  //             >
  //               {column.columnDef.header as string}
  //             </label>
  //           </div>
  //         ))}
  //       </div>
  //     </DialogContent>
  //   </Dialog>
  // );

  // Pagination and page size controls
  const PaginationControls = () => (
    <div className="flex items-center justify-between p-4 space-x-4">
      {/* <div className="flex items-center space-x-2">
        <span className="text-sm">Rows per page:</span>
        <Select
          value={pagination.pageSize.toString()}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[5, 10, 20, 50, 100].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex justify-end items-center mb-4">
        {/* <ColumnVisibilityToggle /> */}
      </div>
      <div className="rounded-md border">
        <Table className="text-xs">
          <TableHeader className="bg-primary/10 text-primary text-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const size = header.column.getSize();
                  if (header.column.id === 'action') {
                    return (
                      <TableHead
                        key={header.id}
                        className="flex justify-between items-center ">
                        <span>Action</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="flex items-center justify-center p-1">
                              <EllipsisVertical className=" text-primary" />
                            </button>
                          </PopoverTrigger>

                          <PopoverContent side="left" className="w-auto">
                            <TableSettingPopover settings={tableSettings} updateSettings={updateTableSettings} columnHeaders={columnHeaders} />
                          </PopoverContent>
                        </Popover>
                      </TableHead>
                    );
                  }
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: `${size}px`,
                        position: 'relative',
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <div
                        onMouseDown={header.getResizeHandler()}
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none hover:bg-blue-500"
                      />
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                className={`${index % 2 === 0
                  ? "bg-white dark:bg-muted"
                  : "bg-primary/5 dark:bg-primary/5"
                  }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <PaginationControls />
    </div>
  );
}

export default AdvancedTable;
