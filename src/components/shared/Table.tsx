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
import { EllipsisVertical } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import TableSettingPopover, { TableSettings } from '@/pages/master/components/TableSettings';
import PinningControls from './PinningControl';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination';
import { GetReqParams, TableRequestParams } from '@/types/data';
import { cn } from '@/lib/utils';


interface AdvancedTableProps<T> {
  columns: Array<{
    accessorKey: string;
    header: string;
    size?: number;
    cell?: (info: any) => React.ReactNode;
  }>;
  data: T[];
  totalCount: number;
  requestParams: GetReqParams;
  onRequestParamsChange?: (params: GetReqParams) => void;
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
  const [loading, setLoading] = useState<boolean>(true)
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

  const handleUpdateTableSettings = (updatedSettings: Partial<TableSettings>) => {
    setTableSettings(prev => ({
      ...prev,
      ...updatedSettings
    }));

    // If you need to update pagination in React Table
    if (updatedSettings.pageSize) {
      table.setPageSize(updatedSettings.pageSize);
    }
  };

  // Handle pagination and parameter changes
  const handlePaginationChange = (updaterOrValue: PaginationState | ((oldState: PaginationState) => PaginationState)) => {
    const newPagination = typeof updaterOrValue === 'function'
      ? updaterOrValue(pagination)
      : updaterOrValue;

    setPagination(newPagination);

    if (onRequestParamsChange) {
      const newParams: GetReqParams = {
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

  const PaginationControls = ({ pagination, table }: { pagination: { pageIndex: number; pageSize: number }; table: any }) => {

    return (
      <Pagination>
        <div className="grid grid-cols-3 items-center w-full gap-4">
          {/* Left Section: Rows per page */}
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
                {[2, 5, 10, 20, 50, 100].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-slate-400">of {totalCount}</span>
          </div>

          {/* Center Section: Pagination Controls */}
          <PaginationContent className="flex items-center justify-center space-x-1">
            {/* Previous Page Button */}
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => table.previousPage()}
                className={cn(
                  'text-xs',
                  !table.getCanPreviousPage() && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>

            {/* Page Number Items */}
            {[...Array(table.getPageCount())].map((_, index) => {
              const pageIndex = index + 1;
              return (
                <PaginationItem key={pageIndex}>
                  <PaginationLink
                    href="#"
                    isActive={pagination.pageIndex === index}
                    onClick={() => table.setPageIndex(index)}
                    className={cn(
                      "w-8 h-8 p-0 hover:bg-primary/10 text-xs flex items-center justify-center",
                      pagination.pageIndex === index
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : ""
                    )}
                  >
                    {pageIndex}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {/* Ellipsis for pages beyond the current set */}
            {pagination.pageIndex < table.getPageCount() - 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Next Page Button */}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => table.nextPage()}
                className={cn(
                  'text-xs',
                  !table.getCanNextPage() && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
          </PaginationContent>

          {/* Right Section: Placeholder for potential additional controls */}
          <div className="flex justify-end">
            {/* You can add additional controls here if needed */}
          </div>
        </div>
      </Pagination>
    );
  }
  const columnHeaders = table.getAllLeafColumns().map((column, index) => ({
    ...column,
    index,
  }));

  return (
    // <div className="flex flex-col h-[400px]">
    //   <div className="flex-grow overflow-auto">
    //     <table className="relative w-full border">
    //       <thead>
    //         <tr>
    //           <th className="sticky top-0 px-6 py-3 text-red-900 bg-red-300">Header</th>
    //           <th className="sticky top-0 px-6 py-3 text-red-900 bg-red-300">Header</th>
    //           <th className="sticky top-0 px-6 py-3 text-red-900 bg-red-300">Header</th>
    //         </tr>
    //       </thead>
    //       <tbody className="divide-y bg-red-100">
    //         <tr>
    //           <td className="px-6 py-4 text-center">Column</td>
    //           <td className="px-6 py-4 text-center">Column</td>
    //           <td className="px-6 py-4 text-center">Column</td>
    //         </tr>
    //         <tr>
    //           <td className="px-6 py-4 text-center">Column</td>
    //           <td className="px-6 py-4 text-center">Column</td>
    //           <td className="px-6 py-4 text-center">Column</td>
    //         </tr>
    //         <tr>
    //           <td className="px-6 py-4 text-center">Column</td>
    //           <td className="px-6 py-4 text-center">Column</td>
    //           <td className="px-6 py-4 text-center">Column</td>
    //         </tr>
    //         <tr>
    //           <td className="px-6 py-4 text-center">Column</td>
    //           <td className="px-6 py-4 text-center">Column</td>
    //           <td className="px-6 py-4 text-center">Column</td>
    //         </tr>
    //         <tr>
    //           <td className="px-6 py-4 text-center">Column</td>
    //           <td className="px-6 py-4 text-center">Column</td>
    //           <td className="px-6 py-4 text-center">Column</td>
    //         </tr>
    //         <tr>
    //           <td className="px-6 py-4 text-center">Column</td>
    //           <td className="px-6 py-4 text-center">Column</td>
    //           <td className="px-6 py-4 text-center">Column</td>
    //         </tr>
    //       </tbody>
    //       <thead>
    //         <tr>
    //           <th className="sticky top-0 px-6 py-3 text-green-900 bg-green-300">Header</th>
    //           <th className="sticky top-0 px-6 py-3 text-green-900 bg-green-300">Header</th>
    //           <th className="sticky top-0 px-6 py-3 text-green-900 bg-green-300">Header</th>
    //         </tr>
    //       </thead>
    //       <tbody className="divide-y bg-green-100">
    //         <tr>
    //           <td className="px-6 py-4 text-center">Column</td>
    //           <td className="px-6 py-4 text-center">Column</td>
    //           <td className="px-6 py-4 text-center">Column</td>
    //         </tr>
    //         <tr>
    //           <td className="px-6 py-4 text-center">Column</td>
    //           <td className="px-6 py-4 text-center">Column</td>
    //           <td className="px-6 py-4 text-center">Column</td>
    //         </tr>
    //         <tr>
    //           <td className="px-6 py-4 text-center">Column</td>
    //           <td className="px-6 py-4 text-center">Column</td>
    //           <td className="px-6 py-4 text-center">Column</td>
    //         </tr>
    //         <tr>
    //           <td className="px-6 py-4 text-center">Column</td>
    //           <td className="px-6 py-4 text-center">Column</td>
    //           <td className="px-6 py-4 text-center">Column</td>
    //         </tr>
    //         <tr>
    //           <td className="px-6 py-4 text-center">Column</td>
    //           <td className="px-6 py-4 text-center">Column</td>
    //           <td className="px-6 py-4 text-center">Column</td>
    //         </tr>
    //         <tr>
    //           <td className="px-6 py-4 text-center">Column</td>
    //           <td className="px-6 py-4 text-center">Column</td>
    //           <td className="px-6 py-4 text-center">Column</td>
    //         </tr>
    //       </tbody>
    //       <thead>
    //         <tr>
    //           <th className="sticky top-0 px-6 py-3 text-blue-900 bg-blue-300">Header</th>
    //           <th className="sticky top-0 px-6 py-3 text-blue-900 bg-blue-300">Header</th>
    //           <th className="sticky top-0 px-6 py-3 text-blue-900 bg-blue-300">Header</th>
    //         </tr>
    //       </thead>


    //     </table>
    //   </div>
    // </div>
    <div className="flex flex-col h-[400px]">
      <div className="flex-grow overflow-auto">
        <Table className="text-xs relative  w-full border">
          <TableHeader className="bg-primary/25 text-primary text-sm hover:bg-primary ">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} >
                {headerGroup.headers.map((header, index) => {
                  const size = header.column.getSize();
                  const { column } = header;
                  const isPinned = column.getIsPinned();
                  const isLastColumn = index === headerGroup.headers.length - 1;

                  return (
                    <TableHead
                      key={header.id}
                      style={{ ...getCommonPinningStyles(column), width: `${size}px` }}
                      className={`${isPinned
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
                              updateSettings={handleUpdateTableSettings}
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
                          className: ` resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`,
                        }}
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          height: '100%',
                          width: '5px',
                          cursor: 'col-resize',
                          backgroundColor: header.column.getIsResizing() ? 'rgba(0, 0, 255, 0.5)' : 'bg-primary',
                        }}
                      />
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="divide-y overflow-auto"

          >
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
                        ? "min-h-2 bg-primary/10  "
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
      </div >
      <PaginationControls pagination={pagination} table={table} />

    </div>
  );
}

export default AdvancedTable;
// max-h-[55vh] min-h-[50vh] 