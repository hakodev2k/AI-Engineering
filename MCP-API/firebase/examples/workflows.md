# Firebase connector examples

The connector imports current input schemas from the official Firebase MCP server and exposes only a fixed allowlist.

## Inspect the active project

Tool: `firebase.project.get`  
Risk: `READ`  
Approval: no

```json
{}
```

## List Firestore documents

Tool: `firebase.firestore.document.list`  
Risk: `READ`  
Approval: no

Use the arguments shown by your MCP client; they come directly from the current official Firebase MCP schema.

## Add a Firestore document

Tool: `firebase.firestore.document.create`  
Risk: `WRITE`  
Approval: required

Call the tool with the official Firebase MCP arguments plus:

```json
{
  "approval_token": "<HMAC-SHA256 approval bound to the exact payload>"
}
```

## Publish Remote Config

Tool: `firebase.remote_config.template.update`  
Risk: `HIGH_RISK`  
Approval: required

The connector forwards the official `remoteconfig_update_template` input schema and requires payload-bound approval before execution.

## Delete a Firestore document

Tool: `firebase.firestore.document.delete`  
Risk: `DESTRUCTIVE`  
Approval: required  
Additional gate: `FIREBASE_ENABLE_DESTRUCTIVE=true`
