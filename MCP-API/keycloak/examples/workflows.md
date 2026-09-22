# Workflows

## Investigate a user
Tool: `keycloak.user.search`
Input: `{ "search": "alice", "max": 10 }`
Permission: READ. Approval: no.
Expected output: `{ "ok": true, "untrustedProviderData": true, "data": [...] }`.

## Prepare and create a user
Read existing users first, then call `keycloak.user.create` only after the host enables `KEYCLOAK_ALLOW_WRITE=true` and a human approves the exact account data.
Input: `{ "username": "alice", "email": "alice@example.com", "enabled": true, "approved": true }`.
Permission: WRITE.

## Change effective access
Use `keycloak.group.get` to inspect the group and `keycloak.user.get` to inspect the user. `keycloak.group.member.add` is HIGH_RISK because group membership may grant roles/application access. It requires `KEYCLOAK_ALLOW_HIGH_RISK=true` plus explicit approval.

## Delete a user
`keycloak.user.delete` is DESTRUCTIVE, never retried, disabled unless `KEYCLOAK_ALLOW_DESTRUCTIVE=true`, and still requires `approved:true`.
