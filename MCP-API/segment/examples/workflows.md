# Segment MCP workflow examples

The MCP client never receives `SEGMENT_PUBLIC_API_TOKEN`. The connector reads credentials from its own environment.

## Inspect a workspace and its data pipeline

1. `segment.workspace.get` — input `{}` — READ — approval not required.
2. `segment.source.list` — input `{}` — READ — approval not required.
3. `segment.destination.list` — input `{}` — READ — approval not required.
4. `segment.source.get` — input `{"sourceId":"qQEHquLrjRDN9j1ByrChyn"}` — READ — approval not required.

Expected output shape is the Segment Public API JSON envelope, for example `{"data":{"source":{...}}}`.

## Prepare and create a Source

1. Call `segment.catalog.source.list` to find a valid `metadataId`.
2. Prepare `{"slug":"checkout-web","enabled":true,"metadataId":"<catalog-id>","settings":{}}`.
3. An external approval component computes an approval token bound to the exact tool name and payload.
4. Call `segment.source.create` with the same fields plus `approvalId`.

Permission: WRITE. Approval: required by default.

## Manage a Tracking Plan

1. `segment.tracking_plan.list` with `{"type":"LIVE"}` — READ.
2. `segment.tracking_plan.get` with `{"trackingPlanId":"<id>"}` — READ.
3. `segment.tracking_plan.create` with `{"name":"Checkout Tracking Plan","type":"LIVE","description":"Production checkout events","approvalId":"<approval>"}` — WRITE, approval required.
4. `segment.tracking_plan.update` with `{"trackingPlanId":"<id>","description":"Updated description","approvalId":"<approval>"}` — WRITE, approval required.
5. `segment.tracking_plan.delete` with `{"trackingPlanId":"<id>","approvalId":"<approval>"}` — DESTRUCTIVE, explicit approval required.

Tracking Plan operations require the Segment Protocols feature where documented by Segment.
