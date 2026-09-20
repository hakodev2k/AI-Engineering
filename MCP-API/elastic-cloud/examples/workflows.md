# Elastic Cloud MCP workflow examples

## Inspect a deployment

Tool: `elastic-cloud.deployment.list`
Input: `{ "page": 1, "size": 20 }`
Permission: READ
Approval: No
Expected output: MCP text containing `{source:"elastic-cloud",untrusted:true,data:...}`.

Then call `elastic-cloud.deployment.get` with the selected deployment ID, followed by `elastic-cloud.deployment.resource.list` to inspect its resources.

## Check available placement and versions

Call `elastic-cloud.region.list` with `{ "provider": "aws" }`, then `elastic-cloud.stack_version.list` with `{}`. Both are READ operations and require no approval.

## Inspect network restrictions

Call `elastic-cloud.traffic_filter.list` with a region ID, then `elastic-cloud.traffic_filter.get` for a selected ruleset. Provider responses are explicitly marked untrusted.

## Create a deployment

Tool: `elastic-cloud.deployment.create`
Input: `{ "deployment": { ...official Elastic Cloud deployment create request... } }`
Permission: WRITE
Approval: Yes; enable `ELASTIC_CLOUD_APPROVE_WRITES` only for the execution in which a human approved the request.

## Change or stop a deployment

`elastic-cloud.deployment.update` and `elastic-cloud.deployment.shutdown` are HIGH_RISK and require `ELASTIC_CLOUD_APPROVE_HIGH_RISK=true`. `elastic-cloud.deployment.delete` is DESTRUCTIVE and remains disabled unless `ELASTIC_CLOUD_ALLOW_DESTRUCTIVE=true` is deliberately set for the execution.
