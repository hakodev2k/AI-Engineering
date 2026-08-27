# Workflow examples

## Research a sales opportunity

Tool: `pipedrive.item.search`
Input: `{ "term": "Acme", "item_types": "deal,person,organization", "limit": 20 }`
Permission: READ
Approval: no
Expected shape: `{ "data": { "success": true, "data": { "items": [...] } }, "untrusted_external_content": true }`

Then call `pipedrive.deal.get` with the returned deal ID.

## Prepare and execute a deal update

Tool: `pipedrive.deal.update`
Proposed input before approval: `{ "id": 123, "stage_id": 4 }`
Permission: WRITE
Approval: required
Expected output: wrapped Pipedrive API response with `untrusted_external_content: true`.

A trusted approval component computes the HMAC for the exact tool and payload and adds `approvalId` before execution.

## Create a follow-up task

Tool: `pipedrive.activity.create`
Input before approval: `{ "subject": "Follow up with Acme", "type": "call", "due_date": "2026-08-29", "deal_id": 123 }`
Permission: WRITE
Approval: required

## Subscribe to deal updates

Tool: `pipedrive.webhook.create`
Input before approval: `{ "subscription_url": "https://example.com/pipedrive/webhook", "event_action": "updated", "event_object": "deal" }`
Permission: HIGH_RISK
Approval: required

## Remove a webhook

Tool: `pipedrive.webhook.delete`
Input before approval: `{ "id": 456 }`
Permission: DESTRUCTIVE
Approval: required
