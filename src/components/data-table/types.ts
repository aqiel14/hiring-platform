export interface Column<T = any> {
  id: string;
  label: string;
  width: number;
  accessor: (item: T) => string;
  render?: (item: T) => React.ReactNode;
}

export interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  onColumnsChange?: (columns: Column<T>[]) => void;
  defaultPageSize?: number;
  showFilters?: boolean;
  filterableColumns?: string[];
  isResizable?: boolean;
  isDraggable?: boolean;
}
