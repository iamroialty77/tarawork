type CsvTemplateRow = Record<string, string>;

const canonical = (value: string) =>
  value.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");

const COMMON_FIELDS: Record<string, string[]> = {
  name: ["name", "fullname", "contactname", "employeename", "recipientname", "firstname"],
  email: ["email", "emailaddress", "contactemail", "employeeemail", "recipientemail"],
};

function findValue(row: CsvTemplateRow, requestedColumn: string) {
  if (Object.prototype.hasOwnProperty.call(row, requestedColumn)) return row[requestedColumn];

  const indexed = new Map(
    Object.entries(row).map(([key, value]) => [canonical(key), value]),
  );
  const requested = canonical(requestedColumn);
  if (indexed.has(requested)) return indexed.get(requested);

  const aliases = COMMON_FIELDS[requested] || [];
  for (const alias of aliases) {
    if (indexed.has(alias)) return indexed.get(alias);
  }

  return undefined;
}

export function renderCsvTemplate(
  template: string,
  alias: string,
  row?: CsvTemplateRow,
) {
  if (!row) return template;
  return template
    .replace(
      /\{\{\s*([\p{L}\p{N}_-]+)\.([\p{L}\p{N}_-]+)\s*\}\}/gu,
      (match, source: string, column: string) => {
        if (canonical(source) !== canonical(alias)) return match;
        return findValue(row, column) ?? match;
      },
    )
    .replace(
      /\{\{\s*([\p{L}\p{N}_-]+)\s*\}\}/gu,
      (match, column: string) => findValue(row, column) ?? match,
    );
}
