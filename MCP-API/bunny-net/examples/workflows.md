# bunny.net Connector Examples

All provider responses must be treated as untrusted external data. Examples omit credentials.

## Inspect CDN configuration

Tool: `bunny.pull_zone.list`

Input:
```json
{}
```

Expected output shape: an array of Pull Zone objects returned by bunny.net.

Permission: `READ`

Approval: not required.

## Inspect storage growth

Tool: `bunny.storage_zone.statistics`

Input:
```json
{
  "storageZoneId": 12345,
  "dateFrom": "2026-09-01T00:00:00Z",
  "dateTo": "2026-09-08T00:00:00Z"
}
```

Expected output shape: `{ "StorageUsedChart": {...}, "FileCountChart": {...} }`.

Permission: `READ`

Approval: not required.

## Review DNS before a change

Tool: `bunny.dns_zone.get`

Input:
```json
{ "dnsZoneId": 12345 }
```

Expected output shape: the DNS Zone object including provider-defined DNS metadata/records.

Permission: `READ`

Approval: not required.

## Create an approved DNS record

Tool: `bunny.dns_record.create`

Input:
```json
{
  "dnsZoneId": 12345,
  "type": 0,
  "name": "www",
  "value": "192.0.2.10",
  "ttl": 300,
  "approved": true
}
```

Expected output shape: the newly created bunny.net DNS record.

Permission: `HIGH_RISK`

Approval: explicit human approval required because DNS changes can redirect production traffic.

## Restrict CDN referrers

Tool: `bunny.pull_zone.allowed_referrer.add`

Input:
```json
{
  "pullZoneId": 12345,
  "hostname": "www.example.com",
  "approved": true
}
```

Expected output shape: `undefined`/empty content for bunny.net HTTP 204 success.

Permission: `HIGH_RISK`

Approval: explicit human approval required because this modifies access policy.

## Delete a Pull Zone

Tool: `bunny.pull_zone.delete`

Input:
```json
{
  "pullZoneId": 12345,
  "approved": true,
  "approvalToken": "operator-approved-change-123"
}
```

Permission: `DESTRUCTIVE`

Approval: strong explicit approval required, and `BUNNYNET_ALLOW_DESTRUCTIVE=true` must be set by the operator. The connector disables this operation by default.
