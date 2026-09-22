# Workflow examples

- `frontegg.user.list` input `{ "limit": 50, "offset": 0 }` → user page; READ; no approval.
- `frontegg.user.get` input `{ "userId": "USER_ID" }` → user details; READ; no approval.
- `frontegg.tenant.list` input `{ "limit": 50, "filter": "acme" }` → tenant page; READ; no approval.
- `frontegg.tenant.create` input `{ "name": "Acme" }` → created tenant; WRITE; approval required by default.
- `frontegg.tenant.update` input `{ "tenantId": "TENANT_ID", "data": { "name": "Acme EU" } }` → updated tenant; WRITE; approval required by default.
