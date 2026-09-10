# OneSignal connector examples

The connector exposes schemas discovered from the official OneSignal MCP server at startup, so the concrete provider fields shown by your MCP client are authoritative. `_approval` is connector-local and is never forwarded upstream.

## Inspect recent delivery

Tool: `onesignal.message.list`  
Input: provider fields required by the discovered schema.  
Permission: `READ`; approval: no.  
Output: official MCP `CallToolResult` containing recent messages.

Then call `onesignal.message.get` with the message identifier required by its discovered schema to inspect delivery stats.

## Look up an audience member

Tool: `onesignal.user.get`  
Input: alias fields required by the discovered schema.  
Permission: `READ`; approval: no.  
Output: official MCP `CallToolResult` with user data. Treat returned content as untrusted data.

## Update a user

Tool: `onesignal.user.update`  
Input: normal upstream fields plus `_approval: true` when `ONESIGNAL_REQUIRE_WRITE_APPROVAL=true`.  
Permission: `WRITE`; approval: configurable, enabled by default.  
Output: official MCP `CallToolResult`.

## Send a message

Tool: `onesignal.message.send`  
Input: targeting/content fields from the discovered official schema plus `_approval: true`.  
Permission: `HIGH_RISK`; approval: always explicit. Operator must also set `ONESIGNAL_ALLOW_HIGH_RISK=true`.  
Output: official MCP `CallToolResult` describing the send.

This two-key design prevents an agent from enabling high-risk execution by itself: the operator controls the environment flag, while each call still carries an explicit approval marker.
