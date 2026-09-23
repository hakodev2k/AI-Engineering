# Workflow examples

## Record a backend purchase
Tool: `heap.event.track` (WRITE, approval required by default)
```json
{"identity":"customer-42","event":"Order Completed","properties":{"order_id":"o-9","total":129.5},"approved":true}
```
Expected shape: `{ "data": { ...Heap response... }, "trust": "untrusted_provider_data" }`.

## Enrich a known user
Tool: `heap.user.properties.update` (WRITE)
```json
{"identity":"customer-42","properties":{"plan":"pro","region":"apac"},"approved":true}
```

## Privacy deletion
Tool: `heap.privacy.user_deletion.request` (DESTRUCTIVE, strong approval and `HEAP_ENABLE_DESTRUCTIVE=true` required)
```json
{"users":[{"identity":"customer-42"}],"approved":true}
```
Use the returned deletion request id with `heap.privacy.user_deletion.status` (READ).
