# Workflow examples

## Review recent calls
Tool: `dialpad.call.list`
Input: `{ "started_after": 1789516800000 }`
Permission: READ. Approval: no.
Output shape: `{ "source":"dialpad", "untrusted":true, "data": { ...Dialpad response... } }`.

## Fetch a transcript
Tool: `dialpad.call.transcript`
Input: `{ "call_id":"123456789" }`
Permission: READ. Approval: no.

## Send an approved follow-up SMS
Tool: `dialpad.sms.send`
Input: `{ "user_id":"123", "to_numbers":["+14155550100"], "text":"Your appointment is confirmed." }`
Permission: HIGH_RISK. Approval: `DIALPAD_APPROVE_HIGH_RISK=true`. Business messaging registration is required by Dialpad.

## Create a signed webhook
Tool: `dialpad.webhook.create`
Input: `{ "hook_url":"https://example.com/hooks/dialpad", "secret":"replace-with-secret-from-secure-store" }`
Permission: WRITE. Approval: `DIALPAD_APPROVE_WRITE=true`. Store the secret outside prompts and verify Dialpad's signed webhook payloads at the receiver.
