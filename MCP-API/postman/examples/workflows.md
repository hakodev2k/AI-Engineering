# Postman connector workflows

## Discover API assets

1. `postman.workspace.list`
   - Input: `{}`
   - Permission: `READ`
   - Approval: no
   - Output: `{ transport, untrustedProviderData, data }`
2. `postman.collection.list`
   - Input: `{ "workspaceId": "<workspace-id>" }`
   - Permission: `READ`
   - Approval: no
3. `postman.collection.get`
   - Input: `{ "collectionId": "<collection-uid>" }`
   - Permission: `READ`
   - Approval: no

## Create a collection

1. Prepare the intended Postman Collection v2.x document.
2. Compute the approval token when write approval is enabled:
   `HMAC-SHA256(POSTMAN_APPROVAL_SECRET, "postman.collection.create\n" + canonicalArgsJson)`.
3. Call `postman.collection.create` with the collection, optional `workspaceId`, and `approvalToken`.
   - Permission: `WRITE`
   - Approval: configurable, enabled by default

## Run a collection

Call `postman.collection.run` with:

```json
{
  "collectionId": "<collection-uid>",
  "environmentId": "<environment-uid>",
  "iterationCount": 1,
  "approvalToken": "<argument-bound-hmac>"
}
```

Permission: `HIGH_RISK`. Approval is always required because collection requests can invoke external systems and may have side effects.

## Manage an environment

Use `postman.environment.list` and `postman.environment.get` for discovery, then `postman.environment.create` or `postman.environment.replace` for approved changes. Secret values must be supplied by the caller at execution time and must never be placed in prompts, examples, or logs.
