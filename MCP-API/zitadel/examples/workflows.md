# Workflows

- `zitadel.user.search` — `{ "limit":20,"offset":0 }` — READ — no approval — output wraps provider JSON as `untrustedProviderData`.
- `zitadel.user.create_human` — organization, username, profile and email — WRITE — exact tool approval required.
- `zitadel.user.deactivate` — `{ "userId":"..." }` — HIGH_RISK — explicit approval required.
