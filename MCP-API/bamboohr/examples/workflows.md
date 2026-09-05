# BambooHR connector workflows

## Employee lookup

Tool: `bamboohr.employee.directory.read`

Input: use the exact input schema returned by BambooHR's official MCP server for `get_employees_directory`.

Expected output: MCP tool result containing directory data visible under the caller's BambooHR permissions.

Permission: READ. Approval: no connector-level approval.

## Time-off review

Use `bamboohr.time_off.request.list` followed by `bamboohr.time_off.balance.get` before proposing a new request. BambooHR may silently omit inaccessible rows or fields, so a short result means only "nothing this caller can see".

Permission: READ. Approval: none.

## Submit time off

Tool: `bamboohr.time_off.request.create`.

The connector first validates arguments against the live official `create_time_off_request` MCP schema, then requires the exact approval fingerprint printed by the connector before execution when write approval is enabled.

Permission: WRITE. Approval: required by default.

## Goal discussion

Read with `bamboohr.goal.list`, then use `bamboohr.goal.comment.create` only after review.

Permission: READ then WRITE. Approval: required by default for the comment write.
