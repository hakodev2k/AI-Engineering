# Workflow examples

## Inspect capacity before provisioning
Tool: `hetzner_cloud.server_type.list`
Input: `{ "page": 1, "per_page": 25 }`
Permission: READ. Approval: no.
Expected shape: `{ "data": { "items": [...], "meta": {...} }, "untrusted_provider_content": true }`

## Create a server
Tool: `hetzner_cloud.server.create`
Input: `{ "name": "preview-01", "server_type": "cx22", "image": "ubuntu-24.04", "location": "fsn1", "ssh_keys": [12345], "approval": true }`
Permission: HIGH_RISK. Approval: explicit, plus `HETZNER_CLOUD_ALLOW_HIGH_RISK=true`.
Expected shape: `{ "data": { "server": {...}, "action": {...} }, "untrusted_provider_content": true }`

## Graceful shutdown
Tool: `hetzner_cloud.server.power_action`
Input: `{ "server_id": 123, "action": "shutdown", "approval": true }`
Permission: HIGH_RISK. Approval: explicit.
Expected shape: `{ "data": { "action": {...} }, "untrusted_provider_content": true }`

## Delete a server
Tool: `hetzner_cloud.server.delete`
Input: `{ "server_id": 123, "approval": true, "confirm": "DELETE SERVER 123" }`
Permission: DESTRUCTIVE. Approval: explicit, plus `HETZNER_CLOUD_ALLOW_DESTRUCTIVE=true`.
Expected shape: `{ "data": { "deleted": true, "server_id": 123 }, "untrusted_provider_content": true }`
