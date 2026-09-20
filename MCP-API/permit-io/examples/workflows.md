# Workflows

`permit.user.list` with `{ "page":1, "perPage":50, "search":"alice" }` is READ, requires no approval, and returns Permit user records as untrusted provider data.

`permit.role_assignment.list` with `{ "page":1, "perPage":50, "user":"alice@example.com", "tenant":"acme" }` is READ and helps inspect effective role facts without mutation.

`permit.tenant.create` with `{ "key":"acme", "name":"Acme", "approved":true }` is WRITE and requires explicit approval. Expected output is the created Permit tenant object wrapped as untrusted provider data.
