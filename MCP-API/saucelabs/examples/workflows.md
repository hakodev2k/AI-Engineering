# Sauce Labs connector workflows

## Inspect the latest test activity

Tool: `saucelabs.job.list`

Input:
```json
{}
```

Expected output shape: MCP result wrapped as `{ "sourceTrust": "untrusted-provider-data", "data": ... }`.

Permission: `READ`  
Approval: none

## Inspect one job and its artifacts

Tool: `saucelabs.job.get`

Input:
```json
{ "jobId": "eed5eb4999d840f89f67f8b6d60a2da3" }
```

Then call `saucelabs.job.assets.list` with the same `jobId`.

Permission: `READ`  
Approval: none

## Update virtual-device job metadata

Tool: `saucelabs.job.metadata.update`

Input:
```json
{
  "jobId": "eed5eb4999d840f89f67f8b6d60a2da3",
  "name": "Checkout smoke test",
  "tags": ["smoke", "checkout"],
  "passed": true,
  "visibility": "team",
  "approved": true
}
```

Expected output: updated Sauce Labs job object.

Permission: `WRITE`  
Approval: explicit human approval plus `SAUCE_ENABLE_WRITES=true`

## Stop an active virtual-device job

Tool: `saucelabs.job.stop`

Input:
```json
{
  "jobId": "eed5eb4999d840f89f67f8b6d60a2da3",
  "approved": true
}
```

Permission: `HIGH_RISK`  
Approval: explicit human approval plus `SAUCE_ENABLE_WRITES=true`
