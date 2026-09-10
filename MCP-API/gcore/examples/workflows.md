# Gcore connector workflow examples

All examples use the stable connector-facing tool names. Exact provider arguments are derived from the official Gcore MCP schema exposed at runtime.

## Inspect infrastructure

1. Call `gcore.project.list` with the official tool's accepted pagination/filter fields.
2. Call `gcore.region.list`.
3. Call `gcore.instance.list` for the selected project/region.
4. Call `gcore.instance.get` for a specific instance.
5. Use `gcore.volume.list`, `gcore.network.list`, `gcore.security_group.list`, and `gcore.ssh_key.list` to inspect related resources.

Risk: `READ`. Approval: not required.

Expected output shape:

```json
{
  "untrustedProviderData": true,
  "provider": "Gcore",
  "transport": "official-mcp",
  "result": "<official MCP tool result>"
}
```

## Create an instance

Prepare the exact `gcore.instance.create` payload using the schema returned by `tools/list`. A trusted approval service computes the HMAC token over the exact payload and tool name and adds `approvalToken`. The operator must also set `GCORE_ALLOW_WRITE=true`.

Risk: `WRITE`. Approval: required.

## Change instance configuration or power state

Use `gcore.instance.update` for supported instance mutations and `gcore.instance.action` for supported lifecycle actions. Both require `GCORE_ALLOW_HIGH_RISK=true` plus exact-payload approval. The connector never retries these operations automatically.

Risk: `HIGH_RISK`. Approval: required.

## Delete an instance

Use `gcore.instance.delete` only after an explicit human decision. `GCORE_ALLOW_DESTRUCTIVE=true` and exact-payload approval are both required. The connector never retries deletion.

Risk: `DESTRUCTIVE`. Approval: required.
