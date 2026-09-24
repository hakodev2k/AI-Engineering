# Examples

Search (READ, no approval):
```json
{"tool":"algolia.index.search","input":{"index":"products","query":"wireless earbuds","page":0,"hitsPerPage":10}}
```
Expected shape: MCP text content containing `{ "untrusted_provider_data": { "hits": [...], "page": 0 } }`.

Partial update (WRITE, explicit approval + deployment write gate):
```json
{"tool":"algolia.object.partial_update","input":{"index":"products","objectID":"sku-42","object":{"inventory":12},"approved":true}}
```
Expected shape: provider task metadata wrapped as untrusted provider data.

Delete (DESTRUCTIVE, explicit approval + separately enabled destructive gate):
```json
{"tool":"algolia.object.delete","input":{"index":"products","objectID":"sku-42","approved":true}}
```
