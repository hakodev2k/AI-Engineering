# Doppler connector examples

These examples assume the MCP server is configured with `DOPPLER_TOKEN`. Sensitive tools also require a locally generated `approvalId` matching the connector approval policy.

## Discover a project and config

Tool: `doppler.project.list`

Input:
```json
{"page":1,"perPage":20}
```

Permission: `READ`. Approval: no.

Tool: `doppler.config.list`

Input:
```json
{"project":"example-app"}
```

Permission: `READ`. Approval: no.

## Inspect secret names without values

Tool: `doppler.secret.names`

Input:
```json
{"project":"example-app","config":"prd","includeManagedSecrets":true}
```

Permission: `READ`. Approval: no.

## Read one secret value

Tool: `doppler.secret.get`

Input:
```json
{"project":"example-app","config":"prd","name":"DATABASE_URL","approvalId":"<64-hex-approval>"}
```

Permission: `HIGH_RISK`. Approval: required.

Expected output shape:
```json
{"source":"doppler","untrusted":true,"sensitive":true,"data":{}}
```

## Update secrets

Tool: `doppler.secret.update`

Input:
```json
{
  "project":"example-app",
  "config":"prd",
  "secrets":{"FEATURE_FLAG":"enabled"},
  "approvalId":"<64-hex-approval>"
}
```

Permission: `HIGH_RISK`. Approval: required. `DOPPLER_READ_ONLY` must be `false`, and the Doppler token itself must permit the write.
