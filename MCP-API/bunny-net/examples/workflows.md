# bunny.net MCP tool examples

Credentials are read only from connector environment variables and never passed in tool arguments.

## List Pull Zones

Tool: `bunny.pull_zone.list`

```json
{}
```

Permission: READ. Approval: no.

## Inspect a DNS Zone

Tool: `bunny.dns_zone.get`

```json
{"id":12345}
```

Permission: READ. Approval: no.

## Add an allowed referrer

Tool: `bunny.pull_zone.allowed_referrer.add`

```json
{"id":12345,"hostname":"www.example.com","approval":true}
```

Permission: HIGH_RISK. Approval: explicit human approval. `BUNNY_ALLOW_HIGH_RISK=true` must be configured by the operator.

## Add a DNS A record

Tool: `bunny.dns_record.add`

```json
{"zone_id":12345,"record":{"Type":0,"Name":"api","Value":"203.0.113.10","Ttl":300},"approval":true}
```

Permission: HIGH_RISK. Approval: explicit human approval.

## Delete a Pull Zone

Tool: `bunny.pull_zone.delete`

```json
{"id":12345,"approval":true}
```

Permission: DESTRUCTIVE. Approval: explicit strong human approval. `BUNNY_ALLOW_DESTRUCTIVE=true` must be configured by the operator.
