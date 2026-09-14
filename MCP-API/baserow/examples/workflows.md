# Baserow MCP workflow examples

These examples contain no credentials. `approvalId` values are produced outside the model by an approval service using the configured `BASEROW_APPROVAL_SECRET`; do not ask an LLM to generate or reveal that secret.

## Inspect schema and rows

Tool: `baserow.field.list`

```json
{ "tableId": 123 }
```

Permission: `READ`. Approval: no.

Expected output: the Baserow field schema array for table `123`.

Tool: `baserow.row.list`

```json
{
  "tableId": 123,
  "page": 1,
  "size": 50,
  "search": "Acme",
  "userFieldNames": true
}
```

Permission: `READ`. Approval: no.

Expected output: Baserow pagination metadata and matching rows.

## Create a task after human approval

Tool: `baserow.row.create`

```json
{
  "tableId": 123,
  "fields": {
    "Name": "Review release notes",
    "Status": "Open"
  },
  "userFieldNames": true,
  "approvalId": "<64-hex approval bound to baserow.row.create + table:123>"
}
```

Permission: `WRITE`. Approval: required by default.

Expected output: the newly created row.

## Update one row after human approval

Tool: `baserow.row.update`

```json
{
  "tableId": 123,
  "rowId": 47,
  "fields": {
    "Status": "Done"
  },
  "approvalId": "<64-hex approval bound to baserow.row.update + table:123:row:47>"
}
```

Permission: `WRITE`. Approval: required by default.

Expected output: the updated row.

## Delete one row

Deletion is intentionally a two-gate operation: `BASEROW_ENABLE_DELETE=true` must be set by the operator and a resource-bound approval must be supplied.

Tool: `baserow.row.delete`

```json
{
  "tableId": 123,
  "rowId": 47,
  "approvalId": "<64-hex approval bound to baserow.row.delete + table:123:row:47>"
}
```

Permission: `DESTRUCTIVE`. Approval: always required.

Expected output:

```json
{ "deleted": true, "tableId": 123, "rowId": 47 }
```
