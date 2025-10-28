import React from "react";
import { Input } from "@/components/ui/input";
import { Column } from "./types";

interface TableFiltersProps<T = any> {
  columns: Column<T>[];
  filters: Record<string, string>;
  onFiltersChange: (filters: Record<string, string>) => void;
}

function TableFilters<T = any>({
  columns,
  filters,
  onFiltersChange,
}: TableFiltersProps<T>) {
  const handleFilterChange = (columnId: string, value: string) => {
    onFiltersChange({ ...filters, [columnId]: value });
  };

  return (
    <div className="p-4 border-b border-neutral-30 grid grid-cols-2 md:grid-cols-4 gap-3">
      {columns.map((column) => (
        <Input
          key={`filter-${column.id}`}
          placeholder={`Filter by ${column.label}`}
          value={filters[column.id] || ""}
          onChange={(e) => handleFilterChange(column.id, e.target.value)}
          className="h-9"
        />
      ))}
    </div>
  );
}

export default TableFilters;
