# LaunchDarkly connector examples

## Read flags

Tool: `launchdarkly.flag.list`

```json
{
  "projectKey": "example-project",
  "environmentKey": "production",
  "limit": 20,
  "offset": 0
}
```

Permission: `READ`. Approval: no.

Expected output shape:

```json
{
  "provider": "launchdarkly",
  "untrustedProviderData": true,
  "data": {}
}
```

## Create a flag

Tool: `launchdarkly.flag.create`

```json
{
  "projectKey": "example-project",
  "name": "New checkout",
  "flagKey": "new-checkout",
  "description": "Controls the new checkout flow",
  "temporary": true,
  "tags": ["checkout"],
  "approvalId": "<HMAC approval generated outside the model>"
}
```

Permission: `WRITE`. Approval: required.

## Update targeting or rollout configuration

Tool: `launchdarkly.flag.update`

```json
{
  "projectKey": "example-project",
  "flagKey": "new-checkout",
  "patch": [
    {
      "op": "replace",
      "path": "/environments/production/on",
      "value": true
    }
  ],
  "comment": "Approved production rollout",
  "dryRun": false,
  "approvalId": "<HMAC approval generated outside the model>"
}
```

Permission: `HIGH_RISK`. Approval: required.

## List segments

Tool: `launchdarkly.segment.list`

```json
{
  "projectKey": "example-project",
  "environmentKey": "production",
  "limit": 20,
  "offset": 0
}
```

Permission: `READ`. Approval: no.

## Create a webhook

Tool: `launchdarkly.webhook.create`

```json
{
  "url": "https://hooks.example.com/launchdarkly",
  "on": true,
  "name": "Approved audit integration",
  "approvalId": "<HMAC approval generated outside the model>"
}
```

Permission: `HIGH_RISK`. Approval: required because LaunchDarkly will send activity payloads to an external endpoint.
