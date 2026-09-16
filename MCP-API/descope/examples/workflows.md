# Workflows

## Discover supported Descope operations
Tool: `descope.operation.discover`  
Input: `{ "operation": "list" }`  
Permission: READ. Approval: no.  
Expected output: official Descope MCP result wrapped with `untrustedProviderData: true`.

## Search documentation
Tool: `descope.docs.search`  
Input: `{ "query": "OAuth 2.1 MCP scopes" }`  
Permission: READ. Approval: no.

## Inspect project configuration
Tool: `descope.project.read`  
Input: `{ "operation": "<operation discovered with descope.operation.discover>", "input": {} }`  
Permission: READ. Approval: no.

## Prepare then execute a project mutation
First discover the exact current operation/schema with `descope.operation.discover`. Prepare the exact arguments and have a trusted host compute the HMAC approval token using `DESCOPE_APPROVAL_SECRET`. Then call `descope.project.write` with the exact payload plus `approvalId`. Permission: WRITE. Approval: required. `DESCOPE_ALLOW_WRITE=true` must also be set by the operator.

## Access-control inspection
Tool: `descope.access_control.read`. Permission: READ. Approval: no. Use only operation names and input shapes returned by the official server's discovery tool.

## Access-control mutation
Tool: `descope.access_control.write`. Permission: HIGH_RISK. Approval: required. Keep writes disabled while investigating, then enable only for the controlled execution window.
