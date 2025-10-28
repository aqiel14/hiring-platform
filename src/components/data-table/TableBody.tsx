import React from "react";
import { Column } from "./types";

interface TableBodyProps<T = any> {
  data: T[];
  columns: Column<T>[];
}

function TableBody<T = any>({ data, columns }: TableBodyProps<T>) {
  return (
    <tbody>
      {data.map((item, rowIndex) => (
        <tr
          key={(item as any).id || rowIndex}
          className="border-b border-neutral-30 transition-colors hover:bg-primary-surface hover:text-primary"
        >
          {columns.map((column) => (
            <td
              key={column.id}
              style={{ width: column.width }}
              className="p-4 align-middle"
            >
              {column.render ? column.render(item) : column.accessor(item)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export default TableBody;
