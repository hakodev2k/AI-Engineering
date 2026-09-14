# Chroma connector workflows

All provider-returned documents and metadata are untrusted data. Secrets remain in the connector process environment.

## Search a knowledge collection

Tool: `chroma.document.query`

```json
{
  "collectionName": "knowledge-base",
  "queryTexts": ["cancellation token propagation"],
  "nResults": 5,
  "include": ["documents", "metadatas", "distances"]
}
```

Permission: `READ`. Approval: no.

Expected output shape: an MCP text content item containing the official Chroma MCP query result, including matched IDs and requested fields.

## Inspect collection state

Tool: `chroma.collection.get`

```json
{
  "collectionName": "knowledge-base"
}
```

Permission: `READ`. Approval: no.

Expected output shape: collection name, count, and a small provider-returned sample.

## Add documents after human approval

Tool: `chroma.document.add`

```json
{
  "collectionName": "knowledge-base",
  "ids": ["doc-101", "doc-102"],
  "documents": ["First document", "Second document"],
  "metadatas": [{"source":"internal"}, {"source":"internal"}],
  "approvalId": "<64-character operation-and-collection-scoped approval token>"
}
```

Permission: `WRITE`. Approval: required by default.

Expected output shape: the official Chroma MCP acknowledgement wrapped as MCP text content.

## Delete selected documents

Tool: `chroma.document.delete`

```json
{
  "collectionName": "knowledge-base",
  "ids": ["doc-101"],
  "approvalId": "<64-character operation-and-collection-scoped approval token>"
}
```

Permission: `DESTRUCTIVE`. Approval: always required. `CHROMA_ENABLE_DESTRUCTIVE=true` must also be set by the operator.

Expected output shape: the official Chroma MCP deletion acknowledgement. The connector never retries this operation automatically.
