# Onfleet connector examples

## Inspect delayed work

Tool: `onfleet.task.list`

Input:
```json
{"state":"1"}
```

Permission: READ. Approval: no.

Expected output shape:
```json
{"provider":"Onfleet","tool":"onfleet.task.list","risk":"READ","untrusted_provider_content":true,"data":{"tasks":[]}}
```

## Find nearby drivers

Tool: `onfleet.worker.nearby`

Input:
```json
{"longitude":-122.41275,"latitude":37.78998,"radius":5000}
```

Permission: READ. Approval: no.

## Create a delivery task

Tool: `onfleet.task.create`

Input:
```json
{
  "destination":{"address":{"unparsed":"1 Market St, San Francisco, CA"}},
  "recipients":[{"name":"Example Recipient","phone":"+14155550123"}],
  "notes":"Leave with reception",
  "approval":"approved"
}
```

Permission: WRITE. Approval: `approved`. The server must also be started with `ONFLEET_ALLOW_WRITES=true`.

## Register an event webhook

Tool: `onfleet.webhook.create`

Input:
```json
{
  "url":"https://hooks.example.com/onfleet",
  "name":"Task completed",
  "trigger":3,
  "approval":"approved-high-risk"
}
```

Permission: HIGH_RISK. Approval: `approved-high-risk`. Requires both `ONFLEET_ALLOW_WRITES=true` and `ONFLEET_ALLOW_HIGH_RISK=true`. Only public HTTPS destinations are accepted.

## Remove a webhook

Tool: `onfleet.webhook.delete`

Input:
```json
{"webhookId":"ZnVRY8rdfUwNPjHQy2QthtxZ","approval":"approved-high-risk"}
```

Permission: DESTRUCTIVE. Approval: `approved-high-risk` plus both write/high-risk runtime switches.
