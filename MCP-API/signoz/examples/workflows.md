# SigNoz Connector Examples

## Investigate service health

1. `signoz.service.list`
   - permission: READ
   - approval: no
   - input: `{ "arguments": {} }`
2. `signoz.trace.search`
   - permission: READ
   - approval: no
   - input: `{ "arguments": { "serviceName": "checkout" } }`
3. `signoz.log.search`
   - permission: READ
   - approval: no
   - input: `{ "arguments": { "query": "service.name = 'checkout'" } }`

Expected output is the structured result returned by the official SigNoz MCP tool, serialized as JSON text.

## Create an alert rule

Tool: `signoz.alert.create`

Permission: WRITE

Approval: required

Example input:

```json
{
  "arguments": {
    "alert": {
      "alertName": "checkout-high-error-rate"
    }
  },
  "approved": true,
  "approvalReason": "Operator approved creation of the monitoring rule"
}
```

The `arguments` object must conform to the current official SigNoz MCP tool schema advertised by the upstream server.

## Delete an alert rule

Tool: `signoz.alert.delete`

Permission: DESTRUCTIVE

Approval: required, and `SIGNOZ_ALLOW_DESTRUCTIVE=true` must be configured by the operator.
