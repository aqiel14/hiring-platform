import React, { useState, useMemo } from "react";
import { Column, SortConfig, DataTableProps } from "./types";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import TableFilters from "./TableFilters";
import TablePagination from "./TablePagination";

function DataTable<T = any>({
  data,
  columns: initialColumns,
  onColumnsChange,
  defaultPageSize = 10,
  showFilters = true,
  filterableColumns,
  isResizable = false,
  isDraggable = false,
}: DataTableProps<T>) {
  const [columns, setColumns] = useState<Column<T>[]>(initialColumns);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Handle column updates
  const handleColumnsChange = (newColumns: Column<T>[]) => {
    setColumns(newColumns);
    onColumnsChange?.(newColumns);
  };

  // Apply filtering and sorting
  const processedData = useMemo(() => {
    let filtered = [...data];

    // Apply filters
    Object.keys(filters).forEach((key) => {
      const filterValue = filters[key].toLowerCase();
      if (filterValue) {
        const column = columns.find((col) => col.id === key);
        if (column) {
          filtered = filtered.filter((item) =>
            column.accessor(item).toLowerCase().includes(filterValue)
          );
        }
      }
    });

    // Apply sorting
    if (sortConfig) {
      const column = columns.find((col) => col.id === sortConfig.key);
      if (column) {
        filtered.sort((a, b) => {
          const aValue = column.accessor(a);
          const bValue = column.accessor(b);

          if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        });
      }
    }

    return filtered;
  }, [data, filters, sortConfig, columns]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const columnsToFilter = filterableColumns
    ? columns.filter((col) => filterableColumns.includes(col.id))
    : columns.slice(0, 4);

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white shadow">
      {showFilters && (
        <TableFilters
          columns={columnsToFilter}
          filters={filters}
          onFiltersChange={setFilters}
        />
      )}

      <div className="overflow-x-auto">
        <table className="w-full caption-bottom text-sm">
          <TableHeader
            columns={columns}
            sortConfig={sortConfig}
            onSort={setSortConfig}
            onColumnsChange={handleColumnsChange}
            isResizable={isResizable}
            isDraggable={isDraggable}
          />
          <TableBody data={paginatedData} columns={columns} />
        </table>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={processedData.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}

export default DataTable;
