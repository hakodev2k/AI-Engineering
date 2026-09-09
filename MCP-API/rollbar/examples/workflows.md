# Rollbar connector workflows

## Triage
Tool: `rollbar.item.list`
Input: `{"status":"active","level":"error","environment":"production","limit":20}`
Permission: READ. Approval: no.
Output: `{provider:"rollbar",untrusted_data:true,result:<official MCP response>}`.

Then inspect `rollbar.item.get` with `{"counter":12345,"max_tokens":10000}` and `rollbar.occurrence.list` with `{"counter":12345,"limit":3}`.

## Resolve after verification
Tool: `rollbar.item.update`
Input: `{"itemId":98765,"status":"resolved","approved":true}`
Permission: WRITE. Approval: required by default. `approved=true` must only be supplied after a human has approved the exact update.

## Record a production deployment
Tool: `rollbar.deployment.create`
Input: `{"environment":"production","revision":"0123456789abcdef","comment":"release 2026.09.09","approved":true}`
Permission: HIGH_RISK. Approval: required. Uses the REST fallback and the isolated `ROLLBAR_POST_SERVER_TOKEN`.
