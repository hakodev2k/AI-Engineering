# Workflows

## Inspect search health

1. `algolia.application.list` — input `{}` — READ, no approval. Output: official MCP application result.
2. `algolia.index.list` — input `{ "applicationId": "APP_ID" }` — READ, no approval. Output: official MCP index result.
3. `algolia.record.search` — input `{ "applicationId": "APP_ID", "indexName": "products", "query": "wireless earbuds", "hitsPerPage": 20 }` — READ, no approval. Output: ranked search result from official MCP.
4. `algolia.analytics.no_results_rate` — input `{ "applicationId": "APP_ID", "indexName": "products", "startDate": "2026-09-01", "endDate": "2026-09-23" }` — READ, no approval. Output: analytics result from official MCP.

## Add a record

`algolia.record.create` input:
```json
{ "indexName": "products", "object": { "objectID": "sku-42", "name": "Example" }, "approved": true }
```
Risk: WRITE. Approval: required, and `ALGOLIA_WRITE_ENABLED=true` must be configured by the host. Expected output shape is Algolia's task response, typically including a task identifier.

## Partial update

`algolia.record.partial_update` input:
```json
{ "indexName": "products", "objectID": "sku-42", "attributes": { "inventory": 8 }, "approved": true }
```
Risk: WRITE. Approval: required. Expected output is Algolia's task response. Do not place credentials in any tool input.
