# Workflow examples

All examples are MCP tool calls; credentials remain inside the connector.

- `algolia.index.list` with `{ "page": 0, "hitsPerPage": 20 }` → READ, no approval.
- `algolia.record.search` with `{ "index": "products", "query": "wireless earbuds", "hitsPerPage": 10 }` → READ, no approval; official Algolia MCP first when configured, REST fallback otherwise.
- `algolia.record.get` with `{ "index": "products", "objectID": "sku-42" }` → READ.
- `algolia.analytics.top_searches` with `{ "index":"products", "startDate":"2026-08-01", "endDate":"2026-08-26", "limit":20 }` → READ.
- `algolia.record.save` with `{ "index":"products", "record":{"objectID":"sku-42","name":"Headphones"}, "approval":"<payload-bound-64-hex-token>" }` → WRITE, approval required.
- `algolia.record.delete` → DESTRUCTIVE, approval required, and the provider delete call is never automatically retried.
