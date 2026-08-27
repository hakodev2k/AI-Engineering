# Meilisearch connector examples

## Search an index

Tool: `meilisearch.search.query`  
Permission: `READ`  
Approval: no

```json
{
  "uid": "products",
  "q": "wireless keyboard",
  "limit": 10,
  "filter": "in_stock = true",
  "sort": ["price:asc"],
  "attributesToRetrieve": ["id", "name", "price", "in_stock"]
}
```

Expected output shape:

```json
{
  "untrusted_provider_data": true,
  "data": { "hits": [], "processingTimeMs": 1, "query": "wireless keyboard" }
}
```

## Add or update documents

Tool: `meilisearch.document.add_or_update`  
Permission: `WRITE`  
Approval: required

```json
{
  "uid": "products",
  "documents": [{ "id": 42, "name": "Mechanical Keyboard", "price": 99 }],
  "approval_token": "<HMAC-SHA256 approval for this exact payload>"
}
```

Expected output is a Meilisearch summarized task object.

## Update relevance settings

Tool: `meilisearch.settings.update`  
Permission: `HIGH_RISK`  
Approval: required

```json
{
  "uid": "products",
  "settings": { "filterableAttributes": ["brand", "in_stock"], "sortableAttributes": ["price"] },
  "approval_token": "<HMAC-SHA256 approval for this exact payload>"
}
```

## Cancel a bounded set of tasks

Tool: `meilisearch.task.cancel`  
Permission: `HIGH_RISK`  
Approval: required

```json
{
  "indexUids": ["products"],
  "statuses": ["enqueued"],
  "approval_token": "<HMAC-SHA256 approval for this exact payload>"
}
```
