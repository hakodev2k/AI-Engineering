# Workflow examples

## Discover tenant identities
1. `zitadel.organization.list` — `{ "limit": 25 }` — READ — no approval.
2. `zitadel.user.list` — `{ "orgId": "<org-id>", "count": 50 }` — READ — no approval.
3. `zitadel.user.get` — `{ "orgId": "<org-id>", "userId": "<user-id>" }` — READ — no approval.

## Provision a user
`zitadel.user.create` with `orgId`, `userName`, `givenName`, `familyName`, `email`, and `approved: true`. Expected output is the SCIM user resource. WRITE; human approval required by default.

## Suspend access
`zitadel.user.deactivate` with `orgId`, `userId`, `approved: true`. Expected output `{ "ok": true }`. HIGH_RISK; explicit approval required.

## Delete identity
`zitadel.user.delete` requires `approved: true` and `ZITADEL_ALLOW_DESTRUCTIVE=true`. DESTRUCTIVE and disabled by default.