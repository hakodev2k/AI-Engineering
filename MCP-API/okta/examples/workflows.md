# Okta Connector Workflows

## 1. Read-only identity investigation

Tool: `okta.user.search`

```json
{
  "search": "profile.department eq \"Engineering\"",
  "limit": 50
}
```

Permission: `READ`  
Required scope: `okta.users.read`  
Approval: no

Expected output shape:

```json
{
  "provider": "okta",
  "transport": "mcp",
  "risk": "READ",
  "untrusted": true,
  "data": []
}
```

The connector prefers the official Okta MCP `list_users` tool and falls back to `GET /api/v1/users` when allowed and necessary.

## 2. Security event investigation

Tool: `okta.system_log.query`

```json
{
  "since": "2026-08-25T00:00:00Z",
  "filter": "eventType eq \"user.session.start\" and outcome.result eq \"FAILURE\"",
  "limit": 100
}
```

Permission: `READ`  
Required scope: `okta.logs.read`  
Approval: no

## 3. Stage a new user

Tool: `okta.user.create`

```json
{
  "profile": {
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "login": "jane.doe@example.com"
  },
  "activate": false,
  "approvalId": "<64-character externally generated HMAC approval token>"
}
```

Permission: `HIGH_RISK`  
Required scope: `okta.users.manage`  
Approval: yes

`activate` defaults to `false`, so the connector does not silently send an activation email or trigger activation-related downstream provisioning.

## 4. Add a user to a group

Tool: `okta.group.member.add`

```json
{
  "groupId": "00g123",
  "userId": "00u123",
  "approvalId": "<64-character externally generated HMAC approval token>"
}
```

Permission: `HIGH_RISK`  
Required scope: `okta.groups.manage`  
Approval: yes

Membership changes are high risk because group membership can grant application access or administrative permissions.

## Approval token contract

Approval tokens are deliberately generated outside the MCP tool surface so the model cannot approve its own mutation. The approving system computes:

```text
HMAC-SHA256(
  key = OKTA_APPROVAL_SECRET,
  message = "<tool-name>\n<canonical-payload-json>"
)
```

`canonical-payload-json` contains all tool arguments except `approvalId`, recursively serialized with object keys in lexical order. The result is a lowercase 64-character hex digest.
