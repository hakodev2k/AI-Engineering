# Clerk connector workflow examples

## Investigate account access

1. Call `clerk.user.list` with `{ "query": "person@example.com", "limit": 10, "offset": 0 }`.
2. Call `clerk.user.get` for the selected user.
3. Call `clerk.session.list` with the selected `userId`.

All three are READ operations and require no approval.

## Invite an organization member

1. Call `clerk.organization.get`.
2. Call `clerk.organization.membership.list` to avoid duplicate membership.
3. Prepare `clerk.organization.invitation.create`.
4. Execute only after a human supplies `approval.confirmed=true` plus a reason.

The final action sends an external email and is HIGH_RISK.

## Revoke a compromised session

1. Use `clerk.session.list` to identify the exact session.
2. Present the session and consequence to the human operator.
3. Execute `clerk.session.revoke` only with explicit approval.

Revocation is HIGH_RISK because it immediately changes user access.
