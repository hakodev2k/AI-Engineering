# Railway connector examples

The exact input schema for each exposed tool is derived at runtime from Railway's official MCP server and then tightened by this connector. Inspect `tools/list` for the current official schema.

## Inspect projects

Tool: `railway.project.list`  
Risk: `READ`  
Approval: no

```json
{}
```

## Create a project

Tool: `railway.project.create`  
Risk: `WRITE`  
Approval: required

```json
{
  "name": "agent-demo",
  "approval_token": "<HMAC bound to this exact payload>"
}
```

## Inspect logs

Tool: `railway.observability.logs`  
Risk: `READ`  
Approval: no

Use the project/service/environment selectors required by the current Railway MCP schema returned by `tools/list`.

## Deploy

Tool: `railway.deployment.deploy`  
Risk: `HIGH_RISK`  
Approval: required  
Feature gate: `RAILWAY_ENABLE_HIGH_RISK=true`

Deployment is deliberately disabled by default. Generate approval only after reviewing the exact payload exposed by the current Railway MCP schema.

## Set variables

Tool: `railway.variable.set`  
Risk: `HIGH_RISK`  
Approval: required  
Feature gate: `RAILWAY_ENABLE_HIGH_RISK=true`

Variable mutation can change application behavior or expose credentials. The connector therefore requires both a feature gate and payload-bound approval.
