# Auth0 MCP workflow examples

## Investigate a login problem

1. `auth0.user.search` with `{ "q": "email:\"user@example.com\"" }` — READ, no approval.
2. `auth0.user.get` with the returned `userId` — READ, no approval.
3. `auth0.log.list` with a narrow query such as `{ "q": "user_id:\"auth0|...\"", "take": 25 }` — READ, no approval.

Expected outputs are JSON documents returned by the Auth0 Management API and wrapped as MCP text content.

## Provision a database user

Call `auth0.user.create` with a configured database connection, email or username, optional password, and a payload-bound `approvalId`. Permission: WRITE. Scope: `create:users`. Human approval: required.

## Safely block a user

Call `auth0.user.update` with `{ "userId": "auth0|...", "blocked": true, "approvalId": "..." }`. Permission: WRITE. Scope: `update:users`. Human approval: required.

## Remove a user

Call `auth0.user.delete` only after explicit human authorization. Permission: DESTRUCTIVE. Scope: `delete:users`. Human approval: always required. The approval token is bound to the exact `userId` payload so it cannot be reused for another user.

## Inspect tenant configuration

Use `auth0.client.list`, `auth0.connection.list`, and `auth0.role.list` to inspect applications, identity connections, and roles. These are READ operations and do not require approval.
