import React, { useState, useMemo, CSSProperties } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnResizeMode,
  createColumnHelper,
  PaginationState,
  ColumnPinningState,
  Column,
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
import { ChevronLeft, ChevronRight, Columns3, EllipsisVertical, Pin, PinOff, Unplug } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import TableSettingPopover from '@/pages/master/components/TableSettings';
import { Toggle } from '../ui/toggle';
import clsx from 'clsx';
import PinningControls from './PinningControl';

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
  initiallyVisible?: boolean;
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
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: [],
    right: [],
  });
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

      onRequestParamsChange(newParams);
    }
  };

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
      columnPinning,
      pagination,

    },
    onPaginationChange: handlePaginationChange,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
  });

  const getCommonPinningStyles = (column: Column<any>): CSSProperties => {
    const isPinned = column.getIsPinned()
    const isLastLeftPinnedColumn =
      isPinned === 'left' && column.getIsLastColumn('left')
    const isFirstRightPinnedColumn =
      isPinned === 'right' && column.getIsFirstColumn('right')

    return {
      boxShadow: isLastLeftPinnedColumn
        ? '-4px 0 4px -4px gray inset'
        : isFirstRightPinnedColumn
          ? '4px 0 4px -4px gray inset'
          : undefined,
      left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
      right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
      opacity: isPinned ? 0.95 : 1,
      position: isPinned ? 'sticky' : 'relative',
      width: column.getSize(),
      zIndex: isPinned ? 1 : 0,
    }
  }



  const PaginationControls = () => (
    <div className="flex items-center justify-between p-4 space-x-4">
      <div className="flex items-center space-x-2">
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
      </div>

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
  const columnHeaders = table.getAllLeafColumns().map((column, index) => ({
    ...column,
    index,
  }));
  return (
    <div className="w-full">
      <div className="flex justify-end items-center mb-4">
      </div>
      <div className="rounded-md border">
        <Table className="text-xs overflow-auto ">
          <TableHeader className="bg-primary/25 text-primary text-sm hover:bg-primary">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  const size = header.column.getSize();
                  const { column } = header;
                  const isPinned = column.getIsPinned();
                  const isLastColumn = index === headerGroup.headers.length - 1; // Check if it's the last column

                  return (
                    <TableHead
                      key={header.id}
                      style={{ ...getCommonPinningStyles(column), width: `${size}px` }}
                      className={`relative ${isPinned
                        ? "bg-primary text-background"
                        : "bg-primary/5"
                        }`}
                    >
                      <div className="flex justify-between items-center">
                        {/* Header content */}
                        <div className="whitespace-nowrap">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </div>

                        {/* Pinning buttons */}
                        {!header.isPlaceholder && header.column.getCanPin() && (
                          <PinningControls column={header.column} />
                        )}
                      </div>

                      {/* Ellipsis button - only for the last column */}
                      {isLastColumn && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="absolute bottom-3 right-0 z-50">
                              <EllipsisVertical className={`${isPinned ? 'text-background' : 'text-primary'}`} />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent side="left" className="w-auto">
                            <TableSettingPopover
                              settings={tableSettings}
                              updateSettings={updateTableSettings}
                              columnHeaders={columnHeaders}
                            />
                          </PopoverContent>
                        </Popover>
                      )}

                      {/* Resizer */}
                      <div
                        {...{
                          onDoubleClick: () => header.column.resetSize(),
                          onMouseDown: header.getResizeHandler(),
                          onTouchStart: header.getResizeHandler(),
                          className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`,
                        }}
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          height: '100%',
                          width: '5px',
                          cursor: 'col-resize',
                          backgroundColor: header.column.getIsResizing() ? 'rgba(0, 0, 255, 0.5)' : 'transparent',
                        }}
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
                  ? "bg-background dark:bg-muted hover:bg-primary/10"
                  : "bg-primary/5 dark:bg-primary/5 hover:bg-primary/10"
                  }`}
              >
                {row.getVisibleCells().map((cell) => {
                  const { column } = cell;
                  const isPinned = column.getIsPinned()

                  return (
                    <TableCell key={cell.id}
                      style={{ ...getCommonPinningStyles(column) }}
                      className={`${isPinned
                        ? "min-h-2 bg-gray-100  "
                        : "min-h-2 bg-primary/5  "
                        }`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>

            ))}
          </TableBody>
        </Table>
      </div>
      <PaginationControls />
    </div >
  );
}

export default AdvancedTable;
