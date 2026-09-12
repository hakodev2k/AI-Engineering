# Split.io MCP workflow examples

## Inspect a flag

Tool: `split.feature_flag.get`

```json
{"workspaceId":"workspace-id","featureFlagName":"checkout-v2"}
```

Permission: READ. Approval: none. Expected output contains provider metadata plus the untrusted Split API response.

## Create flag metadata

Tool: `split.feature_flag.create`

```json
{
  "workspaceId":"workspace-id",
  "trafficType":"user",
  "name":"checkout-v2",
  "description":"Gradual checkout rollout",
  "approval":"approved"
}
```

Permission: WRITE. Approval: `approved` and `SPLIT_ALLOW_WRITES=true`. This does not configure the flag in any environment.

## Review production definition

Tool: `split.feature_flag_definition.get`

```json
{"workspaceId":"workspace-id","featureFlagName":"checkout-v2","environment":"Production"}
```

Permission: READ. Approval: none.

## Configure an environment

Tool: `split.feature_flag_definition.create`

```json
{
  "workspaceId":"workspace-id",
  "featureFlagName":"checkout-v2",
  "environment":"Staging",
  "treatments":[{"name":"on"},{"name":"off"}],
  "defaultTreatment":"off",
  "defaultRule":[{"treatment":"on","size":10},{"treatment":"off","size":90}],
  "approval":"approved-high-risk"
}
```

Permission: HIGH_RISK. Approval: `approved-high-risk` and `SPLIT_ALLOW_HIGH_RISK=true`.

## Emergency kill using JSON Patch

Tool: `split.feature_flag_definition.patch`

```json
{
  "workspaceId":"workspace-id",
  "featureFlagName":"checkout-v2",
  "environment":"Production",
  "operations":[{"op":"replace","path":"/killed","value":true}],
  "title":"Emergency kill",
  "comment":"Disable rollout after elevated errors",
  "approval":"approved-high-risk"
}
```

Permission: HIGH_RISK. Approval: `approved-high-risk` and `SPLIT_ALLOW_HIGH_RISK=true`. Only allowlisted definition paths are accepted.
