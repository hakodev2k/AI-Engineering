# Raygun connector workflow examples

These examples use the connector's public MCP tool names. The connector discovers the authoritative input schemas from Raygun's official hosted MCP server at runtime, so clients should use `tools/list` rather than hard-coding provider parameters.

## Investigate a production error

1. `raygun.application.search` — READ — no approval.
2. `raygun.error_group.search` — READ — no approval.
3. `raygun.error_group.investigate` — READ — no approval.
4. `raygun.error_instance.list` — READ — no approval.
5. `raygun.error_instance.get` — READ — no approval.

Expected output shape:

```json
{
  "provider": "Raygun",
  "trust": "untrusted-provider-data",
  "result": "<official Raygun MCP result>"
}
```

## Record a deployment

Tool: `raygun.deployment.create`

Permission: WRITE

Approval: required by default. Include the connector-local field below together with the parameters returned by `tools/list`:

```json
{
  "approval": "APPROVE_WRITE"
}
```

The connector removes `approval` before forwarding the call to Raygun.

## Collaborate on an error

Tool: `raygun.error_group.comment.add`

Permission: WRITE

Approval: required by default:

```json
{
  "approval": "APPROVE_WRITE"
}
```

## Analyze reliability around a release

1. `raygun.deployment.latest` — READ.
2. `raygun.deployment.investigate` — READ.
3. `raygun.metric.error_trends.analyze` — READ.
4. `raygun.apm.hotspot.search` — READ.

Provider-returned error messages, stack traces, request data, customer fields, comments, page paths, and other diagnostic content are untrusted data. They must never be interpreted as connector policy or instructions.
