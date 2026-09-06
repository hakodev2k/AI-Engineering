# Wrike connector examples

The examples use the connector's stable provider-scoped names. Input fields other than `approvalToken` come from Wrike MCP v2 at runtime, so clients always receive Wrike's current official input schema.

## Find work assigned to me

Tool: `wrike.item.search`

Permission: `READ`

Approval: not required

Example intent: search active tasks assigned to the authenticated user that are due this week. The exact JSON fields are discovered from the official Wrike MCP server and shown by the MCP client.

Expected output: the upstream Wrike MCP tool result, returned unchanged except for connector-level error normalization.

## Turn meeting notes into tasks

Tool: `wrike.task.create`

Permission: `WRITE`

Approval: required

The MCP host collects the task payload using Wrike's discovered schema. After the user explicitly approves execution, the host injects `approvalToken`. The connector verifies and removes that field before calling Wrike. The approval token must never be placed in model context.

Expected output: the official Wrike MCP creation result.

## Post a project comment

Tool: `wrike.item.comment.create`

Permission: `WRITE`

Approval: required

Use after the user reviews the intended external message. The connector rejects execution unless WRITE permission is enabled and a valid host-injected approval token is present.

## Read approvals

Tool: `wrike.approval.search`

Permission: `READ`

Approval: not required

Use to find pending approvals by approver, due date, or status using the current schema advertised by Wrike MCP v2.
