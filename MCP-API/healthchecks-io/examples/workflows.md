# Healthchecks.io MCP Examples

## Inspect overdue checks

Tool: `healthchecks.check.list`

Input:
```json
{"status":"down"}
```

Permission: READ  
Approval: No

Expected output shape: Healthchecks.io Management API v3 check-list JSON.

## Create a backup check

Tool: `healthchecks.check.create`

Input:
```json
{"name":"Nightly database backup","slug":"nightly-db-backup","tags":"production backup","timeout":86400,"grace":3600,"approved":true}
```

Permission: WRITE  
Approval: Configurable; required by default.

Expected output shape: a Healthchecks.io check object containing fields such as `uuid`, `name`, `status`, and management URLs.

## Review state changes

Tool: `healthchecks.check.flips.list`

Input:
```json
{"id":"CHECK_UUID"}
```

Permission: READ  
Approval: No

Expected output shape: status-change history returned by the v3 flips endpoint.

## Pause maintenance monitoring

Tool: `healthchecks.check.pause`

Input:
```json
{"id":"CHECK_UUID","approved":true}
```

Permission: WRITE  
Approval: Configurable; required by default.

## Delete a retired check

Tool: `healthchecks.check.delete`

Input:
```json
{"id":"CHECK_UUID","approved":true}
```

Permission: DESTRUCTIVE  
Approval: Always required. DELETE requests are never automatically retried.
