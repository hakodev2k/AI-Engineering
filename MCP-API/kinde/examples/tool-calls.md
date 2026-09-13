# Kinde MCP tool examples

Provider responses are returned under `result` and marked `untrusted_provider_content: true`.

## Find a user by email

Tool: `kinde.user.get_by_email`

```json
{ "email": "user@example.com" }
```

Permission: READ. Approval: none.

Expected shape:

```json
{ "provider": "kinde", "tool": "kinde.user.get_by_email", "risk": "READ", "result": { "users": [] } }
```

## Advanced user search

Tool: `kinde.user.search`

```json
{ "query": "Ada", "expand": "identities,properties" }
```

Permission: READ. Approval: none.

## Create an email user

Tool: `kinde.user.create`

```json
{
  "email": "new.user@example.com",
  "given_name": "New",
  "family_name": "User",
  "approval": "approved"
}
```

Permission: WRITE. Requires `KINDE_ALLOW_WRITES=true` plus explicit approval.

## Request password reset

Tool: `kinde.user.password_reset.request`

```json
{ "user_id": "kp_abc123", "approval": "approved-high-risk" }
```

Permission: HIGH_RISK. Requires `KINDE_ALLOW_HIGH_RISK=true`. This changes authentication behavior for the user.

## List organizations

Tool: `kinde.organization.list`

```json
{ "page_size": 50 }
```

Permission: READ. If a `next_token` is returned, pass it to the next call.

## Suspend an organization

Tool: `kinde.organization.suspension.set`

```json
{ "org_code": "org_abc123", "is_suspended": true, "approval": "approved-high-risk" }
```

Permission: HIGH_RISK. Requires `KINDE_ALLOW_HIGH_RISK=true`. Kinde documents that suspension ends active sessions and revokes organization-scoped access and refresh tokens.
