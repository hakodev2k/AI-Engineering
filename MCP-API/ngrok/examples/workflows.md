# ngrok MCP connector examples

## Inspect active endpoints

Tool: `ngrok.endpoint.list`

```json
{ "limit": 20 }
```

Permission: `READ`  
Approval: not required

Expected result shape:

```json
{
  "provider": "ngrok",
  "untrusted_data": true,
  "result": {
    "endpoints": [],
    "next_page_uri": null
  }
}
```

## Create a cloud endpoint

Tool: `ngrok.endpoint.create`

```json
{
  "url": "https://agent-gateway.example.com",
  "type": "cloud",
  "traffic_policy": "on_http_request:\n  - type: forward-internal\n    config:\n      url: https://internal.example",
  "description": "Agent gateway",
  "bindings": ["public"],
  "approved": true
}
```

Permission: `WRITE`  
Approval: required when `NGROK_REQUIRE_WRITE_APPROVAL=true`

## Reserve a domain

Tool: `ngrok.reserved_domain.create`

```json
{
  "domain": "agent.example.com",
  "description": "Production agent ingress",
  "approved": true
}
```

Permission: `WRITE`  
Approval: required when configured

## Release a reserved domain

Tool: `ngrok.reserved_domain.delete`

```json
{
  "domain_id": "rd_2abc123",
  "approved": true
}
```

Permission: `DESTRUCTIVE`  
Approval: explicit approval required, and `NGROK_DESTRUCTIVE_ENABLED=true` must be set by the operator.
