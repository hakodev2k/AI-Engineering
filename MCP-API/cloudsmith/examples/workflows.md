# Cloudsmith connector workflows

## Discover repositories

Tool: `cloudsmith.repository.list`  
Permission: `READ`  
Approval: no

```json
{"owner":"workspace","page":1,"pageSize":20}
```

## Inspect vulnerabilities

1. Call `cloudsmith.package.list` with a bounded query.
2. Call `cloudsmith.package.get` for status/security metadata.
3. Call `cloudsmith.package.vulnerabilities` for scan results.

Example:

```json
{"owner":"workspace","repo":"production","identifier":"PACKAGE_ID","page":1,"pageSize":50}
```

## Quarantine a compromised package

Tool: `cloudsmith.package.quarantine`  
Permission: `HIGH_RISK`  
Approval: required

```json
{
  "owner":"workspace",
  "repo":"production",
  "identifier":"PACKAGE_ID",
  "approval_token":"<payload-bound HMAC>"
}
```

Expected output shape:

```json
{
  "untrusted_provider_data": true,
  "data": {"is_quarantined": true},
  "pagination": {},
  "rateLimit": {}
}
```

## Promote by copying

Tool: `cloudsmith.package.copy`  
Permission: `WRITE`  
Approval: required

```json
{
  "owner":"workspace",
  "repo":"staging",
  "identifier":"PACKAGE_ID",
  "destination":"production",
  "republish":false,
  "approval_token":"<payload-bound HMAC>"
}
```
