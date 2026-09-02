# WorkOS connector workflows

## Inspect enterprise access
1. `workos.organization.get` — `{ "organizationId": "org_..." }` — READ, no approval.
2. `workos.connection.list` — `{ "organizationId": "org_..." }` — READ, no approval.
3. `workos.membership.list` — `{ "organizationId": "org_...", "statuses": ["active"] }` — READ, no approval.

## Invite a teammate safely
1. Inspect the organization and desired role.
2. Approve exact fingerprint `workos.invitation.send:person@example.com:org_...` outside the agent.
3. Call `workos.invitation.send` with `{ "email": "person@example.com", "organizationId": "org_...", "roleSlug": "member" }`.

This sends external email and is always HIGH_RISK.

## Change an existing member role
1. Read `workos.membership.get`.
2. Approve `workos.membership.roles.update:om_...`.
3. Call `workos.membership.roles.update` with `{ "membershipId": "om_...", "roleSlug": "admin" }`.

Role changes are HIGH_RISK because they alter authorization.
