import React from "react";

export default function FormTable({
  columns,
  data,
  className = "",
  colWidths = [],
}) {
  // No data message
  const renderEmptyState = () => (
    <tr>
      <td
        colSpan={columns.length}
        className="text-center py-8 text-gray-500 border border-gray-300"
      >
        데이터가 없습니다
      </td>
    </tr>
  );

  // Calculate the number of columns needed for colgroup
  const getMaxColumns = () => {
    let maxCols = columns.length; // Default number of columns

    // Check multi-column rows to find the maximum number of columns needed
    data.forEach((row) => {
      if (row.type === "multi-column") {
        // Each multi-column item has a label and content, so multiply by 2
        const colCount = row.columns.length * 2;
        maxCols = Math.max(maxCols, colCount);
      }
    });

    return maxCols;
  };

  // Generate colgroup based on provided colWidths or auto-generate
  const renderColgroup = () => {
    const maxCols = getMaxColumns();
    let widths = [];

    // If colWidths is provided, use those values
    if (colWidths && colWidths.length > 0) {
      widths = colWidths;
    }
    // Otherwise, try to generate reasonable defaults
    else {
      // For standard layout, first column is label (usually narrower)
      if (columns.length === 2) {
        widths = ["20%", "80%"];
      }
      // For multi-column layouts, try to distribute evenly
      else if (maxCols === 4) {
        // 2 label-content pairs
        widths = ["15%", "35%", "15%", "35%"];
      }
      // Fallback to auto width
      else {
        widths = Array(maxCols).fill("auto");
      }
    }

    return (
      <colgroup>
        {widths.map((width, index) => (
          <col key={`col-${index}`} style={{ width }} />
        ))}
      </colgroup>
    );
  };

  return (
    <div className={`custom-form-table overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        {renderColgroup()}
        <tbody>
          {data.length > 0
            ? // For custom row layouts, we'll handle the rendering based on the row type
              data.map((row) => {
                // Check if this is a row with special layout (multi-column or colspan)
                if (row.type === "multi-column") {
                  // For rows with multiple columns in a single tr
                  return (
                    <tr
                      key={row.key}
                      className="border-b border-gray-200 last:border-b-0"
                    >
                      {row.columns.map((columnItem, colIndex) => (
                        <React.Fragment key={`${row.key}-col-${colIndex}`}>
                          <th
                            className="border-r border-gray-300 p-3 text-left font-medium text-gray-700 bg-gray-50"
                            style={{
                              width: columnItem.width || "auto",
                              verticalAlign: "middle",
                            }}
                            scope="row"
                          >
                            {columnItem.label}
                          </th>
                          <td
                            className={
                              colIndex < row.columns.length - 1
                                ? "p-3 border-r border-gray-300"
                                : "p-3"
                            }
                            style={{
                              verticalAlign: "middle",
                              width: columnItem.contentWidth || "auto",
                            }}
                          >
                            {columnItem.content}
                          </td>
                        </React.Fragment>
                      ))}
                    </tr>
                  );
                } else if (row.type === "colspan") {
                  // For rows with colspan
                  return (
                    <tr
                      key={row.key}
                      className="border-b border-gray-200 last:border-b-0"
                    >
                      <th
                        className="border-r border-gray-300 p-3 text-left font-medium text-gray-700 bg-gray-50"
                        style={{
                          width: row.labelWidth || "auto",
                          verticalAlign: "middle",
                        }}
                        scope="row"
                      >
                        {row.label}
                      </th>
                      <td
                        colSpan={row.colSpan || 1}
                        className="p-3"
                        style={{ verticalAlign: "middle" }}
                      >
                        {row.content}
                      </td>
                    </tr>
                  );
                } else {
                  // Default row rendering (single column)
                  return (
                    <tr
                      key={row.key}
                      className="border-b border-gray-200 last:border-b-0"
                    >
                      {columns.map((column, columnIndex) => {
                        // If it's the label column (first column), use th instead of td
                        if (columnIndex === 0) {
                          return (
                            <th
                              key={`${row.key}-${column.key}`}
                              className="border-r border-gray-300 p-3 text-left font-medium text-gray-700 bg-gray-50"
                              style={{
                                width: column.width || "auto",
                                verticalAlign: "middle",
                              }}
                              scope="row"
                            >
                              {row[column.dataIndex]}
                            </th>
                          );
                        }

                        // For other columns, use td
                        return (
                          <td
                            key={`${row.key}-${column.key}`}
                            className="p-3"
                            style={{ verticalAlign: "middle" }}
                          >
                            {row[column.dataIndex]}
                          </td>
                        );
                      })}
                    </tr>
                  );
                }
              })
            : renderEmptyState()}
        </tbody>
      </table>
    </div>
  );
}
