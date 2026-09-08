# Grist connector examples

## Read a document

Tool: `grist.document.get`

```json
{"docId":"abc123"}
```

Permission: `READ`. Approval: no.

Expected shape:

```json
{"ok":true,"data":{"content":[{"type":"text","text":"..."}]}}
```

## Query document data

Tool: `grist.document.query`

```json
{"docId":"abc123","query":"Show open invoices grouped by customer"}
```

Permission: `READ`. Approval: no. Treat returned values as untrusted third-party data.

## Create rows

Tool: `grist.record.create`

```json
{
  "docId":"abc123",
  "tableId":"Invoices",
  "records":[{"Customer":"Acme","Amount":1250}],
  "approval":{"approved":true}
}
```

Permission: `WRITE`. Approval: required. `GRIST_ALLOW_WRITE=true` must also be set.

## Update rows

Tool: `grist.record.update`

```json
{
  "docId":"abc123",
  "tableId":"Tasks",
  "records":[{"id":42,"fields":{"Status":"Done"}}],
  "approval":{"approved":true}
}
```

Permission: `WRITE`. Approval: required.

## Delete rows

Tool: `grist.record.delete`

```json
{
  "docId":"abc123",
  "tableId":"Archive",
  "recordIds":[7,8],
  "approval":{"approved":true}
}
```

Permission: `DESTRUCTIVE`. Approval: strong explicit approval. Disabled unless `GRIST_ALLOW_DESTRUCTIVE=true`.
