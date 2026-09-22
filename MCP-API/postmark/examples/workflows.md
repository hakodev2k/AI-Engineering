# Postmark connector workflows

## Inspect delivery
Tool: `postmark.message.outbound.list`  
Input: `{ "count": 25, "offset": 0, "recipient": "person@example.com" }`  
Permission: READ; approval: no.  
Output: Postmark outbound-message page (`TotalCount`, `Messages`).

Then call `postmark.message.outbound.get` with the returned message ID to inspect status and message events.

## Send a transactional message
Tool: `postmark.message.send`  
Input: `{ "from": "verified@example.com", "to": "person@example.com", "subject": "Status", "textBody": "Ready", "approved": true }`  
Permission: HIGH_RISK; approval: always required because it sends an external message.  
Output: Postmark send result containing `MessageID`, recipient, submit time, and error status.

## Suppress a recipient
Tool: `postmark.suppression.create`  
Input: `{ "streamId": "outbound", "emailAddresses": ["person@example.com"], "approved": true }`  
Permission: WRITE; approval: required by default.  
Output: per-address suppression results.
