# Workflow examples

## Inspect an outage
Tool: `instatus.incident.list`
Input: `{ "pageId": "PAGE_ID" }`
Permission: READ; approval: no.
Output: provider incident objects, treated as untrusted data.

## Publish an incident
Tool: `instatus.incident.create`
Input: `{ "pageId":"PAGE_ID", "name":"API degradation", "message":"Elevated error rate", "status":"INVESTIGATING", "approved":true }`
Permission: HIGH_RISK; explicit approval: yes.
Output: created incident object.

## Schedule maintenance
Tool: `instatus.maintenance.create`
Input: `{ "pageId":"PAGE_ID", "name":"Database maintenance", "message":"Planned maintenance", "start":"2026-09-12T02:00:00.000Z", "duration":60, "approved":true }`
Permission: HIGH_RISK; explicit approval: yes.
Output: created maintenance object.
