import React, { useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, GripVertical } from "lucide-react";
import { Column, SortConfig } from "./types";

interface TableHeaderProps<T = any> {
  columns: Column<T>[];
  sortConfig: SortConfig | null;
  onSort: (config: SortConfig) => void;
  onColumnsChange: (columns: Column<T>[]) => void;
  isResizable?: boolean;
  isDraggable?: boolean;
}

function TableHeader<T = any>({
  columns,
  sortConfig,
  onSort,
  onColumnsChange,
  isResizable = true,
  isDraggable = true,
}: TableHeaderProps<T>) {
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);

  const handleSort = (columnId: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === columnId && sortConfig.direction === "asc") {
      direction = "desc";
    }
    onSort({ key: columnId, direction });
  };

  const handleDragStart = (columnId: string) => {
    if (!isDraggable) return;
    setDraggedColumn(columnId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isDraggable) return;
    e.preventDefault();
  };

  const handleDrop = (targetColumnId: string) => {
    if (!isDraggable || !draggedColumn || draggedColumn === targetColumnId)
      return;

    const newColumns = [...columns];
    const draggedIndex = newColumns.findIndex(
      (col) => col.id === draggedColumn
    );
    const targetIndex = newColumns.findIndex(
      (col) => col.id === targetColumnId
    );

    const [removed] = newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, removed);

    onColumnsChange(newColumns);
    setDraggedColumn(null);
  };

  const handleResizeStart = (e: React.MouseEvent, columnId: string) => {
    if (!isResizable) return;
    e.preventDefault();
    const column = columns.find((col) => col.id === columnId);
    if (column) {
      setResizingColumn(columnId);
      setResizeStartX(e.clientX);
      setResizeStartWidth(column.width);
    }
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (resizingColumn) {
        const diff = e.clientX - resizeStartX;
        const newWidth = Math.max(100, resizeStartWidth + diff);

        const newColumns = columns.map((col) =>
          col.id === resizingColumn ? { ...col, width: newWidth } : col
        );
        onColumnsChange(newColumns);
      }
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
    };

    if (resizingColumn) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    resizingColumn,
    resizeStartX,
    resizeStartWidth,
    columns,
    onColumnsChange,
  ]);

  return (
    <thead className="bg-neutral-20">
      <tr>
        {columns.map((column) => (
          <th
            key={column.id}
            style={{ width: column.width }}
            className={`h-12 px-4 text-left align-middle font-bold text-neutral-100 relative select-none ${
              isDraggable ? "cursor-move" : ""
            }`}
            draggable={isDraggable}
            onDragStart={() => handleDragStart(column.id)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            <div className="flex items-center justify-between pr-4">
              <div className="flex items-center gap-2">
                {isDraggable && (
                  <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                )}
                <button
                  onClick={() => handleSort(column.id)}
                  className="flex items-center gap-1 hover:text-gray-900"
                >
                  {column.label}
                  {sortConfig?.key === column.id ? (
                    sortConfig.direction === "asc" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {isResizable && (
                <div
                  className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500 bg-transparent"
                  onMouseDown={(e) => handleResizeStart(e, column.id)}
                  style={{
                    borderRight:
                      resizingColumn === column.id
                        ? "2px solid #3b82f6"
                        : "2px solid transparent",
                  }}
                />
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default TableHeader;
