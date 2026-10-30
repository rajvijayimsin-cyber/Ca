/**
 * Export table data to CSV file and trigger download.
 */
function escapeCell(value: unknown): string {
  const s = String(value == null ? "" : value);
  const escaped = s.split('"').join('""');
  const needsQuote =
    escaped.indexOf(",") >= 0 ||
    escaped.indexOf('"') >= 0 ||
    escaped.indexOf("\n") >= 0 ||
    escaped.indexOf("\r") >= 0;
  return needsQuote ? '"' + escaped + '"' : escaped;
}

export function exportToCSV(
  columns: string[],
  rows: string[][],
  filename: string = "export.csv"
): void {
  const header = columns.map(escapeCell).join(",");
  const body = rows
    .map(function (row) {
      return row.map(escapeCell).join(",");
    })
    .join("\n");

  const csv = header + "\n" + body;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
