# Workflow examples

## Inspect capacity
Tool: `hetzner.server.list`
Input: `{ "page": 1, "perPage": 25 }`
Permission: READ. Approval: no.
Output shape: MCP text content containing `{ "untrustedProviderData": { ... } }`.

Tool: `hetzner.server_type.list`
Input: `{ "page": 1, "perPage": 25 }`
Permission: READ. Approval: no.

## Provision after human approval
Tool: `hetzner.server.create`
Input: `{ "name":"agent-lab-1", "serverType":"cx22", "image":"ubuntu-24.04", "location":"nbg1", "sshKeys":[12345], "labels":{"env":"lab"}, "approvalToken":"<out-of-band approval>" }`
Permission: HIGH_RISK. Approval: required. Creating a server can incur charges.

## Restart after diagnosis
Tool: `hetzner.server.reboot`
Input: `{ "id": 123, "approvalToken":"<out-of-band approval>" }`
Permission: HIGH_RISK. Approval: required.

## Delete with dual confirmation
Tool: `hetzner.server.delete`
Input: `{ "id":123, "confirmServerId":123, "approvalToken":"<out-of-band approval>" }`
Permission: DESTRUCTIVE. Approval: required. The matching ID prevents accidental deletion caused by ambiguous references.
