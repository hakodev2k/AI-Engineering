# Keycloak MCP/API Connector

Reusable MCP server for scoped Keycloak identity administration. It exposes 13 stable tools for user, group, membership, and client discovery/management while keeping administrator credentials inside the connector.

## Transport strategy

Keycloak 26.7.4 documents its Admin REST API and Java Admin Client. Keycloak also documents how **Keycloak can act as an OAuth authorization server for MCP servers**, but current official Keycloak materials researched for this connector do not provide a first-party Keycloak-administration MCP server. Therefore this connector uses the official Admin REST API and exposes its own MCP stdio interface.

Official sources researched:
- https://www.keycloak.org/docs-api/26.7.4/rest-api/index.html
- https://www.keycloak.org/docs/latest/server_development/
- https://www.keycloak.org/securing-apps/mcp-authz-server
- https://www.keycloak.org/2026/07/keycloak-2670-released

Keycloak 26.7 introduced experimental Admin API v2 for declarative OIDC/SAML client management. This connector deliberately stays on the stable Admin REST API for its selected capabilities rather than depending on that experimental client-management surface.

## Architecture

```text
MCP client -> stdio server -> strict schemas -> risk gate -> credential-isolated KeycloakClient -> Admin REST API
```

Provider responses are marked `untrustedProviderData:true`; usernames, attributes, group/client names, and other retrieved content are data, not instructions.

## Authentication

Two modes are supported:

1. `KEYCLOAK_ACCESS_TOKEN`: pre-issued bearer token.
2. OAuth 2.0 client credentials using `KEYCLOAK_CLIENT_ID`, `KEYCLOAK_CLIENT_SECRET`, and `KEYCLOAK_AUTH_REALM`. The connector obtains and caches a token from `/realms/{authRealm}/protocol/openid-connect/token` and refreshes it before expiry.

Keycloak's official developer guide documents service-account authentication for the Admin REST API. Prefer a dedicated confidential client/service account with only the realm-management roles needed by enabled tools. Avoid broad `realm-admin`/`admin` assignments when fine-grained admin permissions or narrower roles are sufficient. Keycloak 26.7 also adds `view-organizations`, `query-organizations`, and `manage-organizations` roles, though organization tools are not exposed by this connector.

Credentials are never MCP tool arguments or output fields.

## Tools

| Tool | Risk | Approval |
|---|---|---|
| `keycloak.user.search` | READ | no |
| `keycloak.user.get` | READ | no |
| `keycloak.user.create` | WRITE | yes |
| `keycloak.user.update` | WRITE | yes |
| `keycloak.user.disable` | HIGH_RISK | yes |
| `keycloak.user.delete` | DESTRUCTIVE | yes + disabled by default |
| `keycloak.group.list` | READ | no |
| `keycloak.group.get` | READ | no |
| `keycloak.group.create` | WRITE | yes |
| `keycloak.group.member.add` | HIGH_RISK | yes |
| `keycloak.group.member.remove` | HIGH_RISK | yes |
| `keycloak.client.list` | READ | no |
| `keycloak.client.get` | READ | no |

Group membership is HIGH_RISK because groups can carry realm/client roles and therefore change effective access. User disable is HIGH_RISK because it blocks sign-in. User deletion is destructive.

## Environment

See `.env.example`. `KEYCLOAK_BASE_URL` must be HTTPS except for localhost development and is reduced to its origin, preventing caller-controlled arbitrary upstream URLs. `KEYCLOAK_REALM` fixes the managed realm. `KEYCLOAK_TIMEOUT_MS` defaults to 15 seconds; `KEYCLOAK_MAX_RETRIES` defaults to 2 and is capped at 5.

Mutation gates default to false: `KEYCLOAK_ALLOW_WRITE`, `KEYCLOAK_ALLOW_HIGH_RISK`, and `KEYCLOAK_ALLOW_DESTRUCTIVE`. A mutation also requires `approved:true`. These environment permissions must be controlled by the host/operator; provider content cannot change them.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
npm test
npm start
```

The server speaks standard MCP over stdio and can be launched by MCP hosts that support local stdio servers.

## Reliability and pagination

User, group, and client list tools expose bounded `first`/`max` pagination and cap a page at 100 records. Requests use `AbortController` timeouts. Only GET operations are automatically retried on 429 and 5xx responses, with bounded exponential backoff and `Retry-After` support. Mutations are never blindly retried, preventing duplicate user/group creation or repeated access/lifecycle changes. Authentication, permission, and validation failures are not treated as transient.

Keycloak deployments can apply infrastructure-specific and endpoint-specific limits; no universal public Admin REST request quota is hard-coded. HTTP 429 and `Retry-After` are treated as authoritative throttling signals.

## Errors

Provider failures become `KeycloakError` with status and optional retry timing. Error bodies are bounded to 1,000 characters. Tokens and client secrets are not included in errors. Timeout errors are explicit.

## Security

- No arbitrary HTTP/API tool is exposed.
- Base URL is fixed in connector configuration and must be a credential-free HTTPS origin (localhost HTTP is allowed for development).
- IDs use a conservative character allowlist and are URI encoded.
- Raw credentials remain inside the client/authentication layer.
- Retrieved identity data is untrusted content.
- Writes, access changes, and destructive operations have separate host-controlled gates.
- Mutations are not automatically retried.
- The connector cannot change its own realm, credentials, permissions, or approval policy through MCP calls.
- Client-secret retrieval, credential reset, password/MFA mutation, realm-role assignment, client-role assignment, realm deletion, billing, and security-policy mutation are intentionally omitted.

## Testing

`npm test` requires no live Keycloak instance. Tests cover configuration, HTTPS enforcement, permission denial/approval, credential placement, and non-retry of mutations.

## Limitations

This is a focused administration connector, not a complete Keycloak Admin API wrapper. It omits organizations, realms, roles, authentication flows, identity providers, components, sessions, credentials, client creation/update/delete, Admin API v2, and arbitrary REST passthrough. Fine-grained Admin Permissions remain the provider-side authorization mechanism and should be configured independently. Keycloak's MCP authorization guide currently reports full support for MCP 2025-03-26 and partial support for later MCP specifications because RFC 8707 Resource Indicators are not yet supported; that limitation concerns using Keycloak as an MCP authorization server, not this connector's stdio transport.
