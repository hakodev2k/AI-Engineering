# Docker Hub MCP/API Connector

Reusable MCP connector for Docker Hub. It exposes a stable provider-scoped tool surface while preferring Docker's official `docker/hub-mcp` server and falling back to the official Docker Hub API v2 where this connector has an explicit, documented mapping.

## Provider and purpose

Provider: Docker Hub

Typical agent workflows:

- Search for container images and inspect repository metadata.
- Discover namespaces and repositories.
- Check whether repositories and tags exist before using them.
- Inspect tags before selecting or deploying an image.
- Query Docker Hardened Images exposed by the official MCP server.
- Create or update repositories only after explicit human approval.

This connector does not implement image push/pull, repository deletion, token management, billing, organization administration, or arbitrary HTTP execution.

## Official sources

- Docker Hub MCP docs: https://docs.docker.com/docker-hub/mcp-server/
- Official Docker Hub MCP source: https://github.com/docker/hub-mcp
- Docker Hub API reference: https://docs.docker.com/reference/api/hub/latest/
- Docker Hub API deprecations: https://docs.docker.com/reference/api/hub/deprecated/
- Docker Hub API changelog: https://docs.docker.com/reference/api/hub/changelog/
- Personal access tokens: https://docs.docker.com/security/access-tokens/
- Docker Hub usage and limits: https://docs.docker.com/docker-hub/usage/

The implementation intentionally uses the newer namespace-scoped API v2 repository routes rather than deprecated legacy repository routes.

## Transport strategy

The external interface is always MCP. Upstream routing is capability-specific:

| Tool | Primary | Fallback |
|---|---|---|
| `dockerhub.search` | Official Docker Hub MCP | None |
| `dockerhub.namespace.list` | Official Docker Hub MCP | None |
| `dockerhub.repository.list` | Official Docker Hub MCP | Docker Hub API v2 |
| `dockerhub.repository.get` | Official Docker Hub MCP | Docker Hub API v2 |
| `dockerhub.repository.check` | Official Docker Hub MCP | None |
| `dockerhub.repository.create` | Official Docker Hub MCP | Docker Hub API v2 |
| `dockerhub.repository.update` | Official Docker Hub MCP | Docker Hub API v2 |
| `dockerhub.tag.list` | Official Docker Hub MCP | Docker Hub API v2 |
| `dockerhub.tag.get` | Official Docker Hub MCP | Docker Hub API v2 |
| `dockerhub.tag.check` | Official Docker Hub MCP | None |
| `dockerhub.hardened_image.list` | Official Docker Hub MCP | None |

For MCP-only capabilities, failure to configure or start the official upstream MCP server fails safely instead of inventing an API route.

## Official MCP tool mapping

The connector maps its stable names to current official `docker/hub-mcp` tools:

- `search`
- `get_namespaces`
- `list_repositories_by_namespace`
- `get_repository_info`
- `check_repository`
- `create_repository`
- `update_repository_info`
- `list_repository_tags`
- `read_repository_tag`
- `check_repository_tag`
- `docker_hardened_images`

Create and update calls follow the official MCP schema and pass repository fields inside the `body` object.

## Architecture

```text
MCP client
  -> this connector (stdio MCP)
     -> policy / validation / allowlists
        -> official Docker Hub MCP server (preferred)
        -> Docker Hub API v2 (explicit fallback only)
           -> credential layer
```

Provider credentials are loaded only from the connector environment. They are never accepted as MCP tool arguments.

## Runtime

- Node.js 20 or newer for this connector
- npm
- Optional but recommended: Docker's official Docker Hub MCP server. Its current upstream repository documents Node.js 22+ for building/running that server.

Install and build:

```bash
npm install
npm run build
```

Run:

```bash
npm start
```

The server communicates over stdio.

## Authentication

### Public read

Some Docker Hub API reads can work without credentials for public content. The official Docker Hub MCP server also documents public-content operation without authentication.

### Authenticated access

Set:

```text
DOCKER_HUB_USERNAME=<docker-id>
DOCKER_HUB_PAT=<personal-access-token>
```

For REST fallback, the connector exchanges the username and PAT at Docker Hub's `/v2/auth/token` endpoint and uses the returned bearer token for resource requests. The PAT is not forwarded to MCP callers or included in resource-request payloads.

Docker documents PAT permission levels as Read, Write, or Delete. Use the least privilege required:

- Read-only workflows: Read.
- Repository create/update workflows: Write.
- Delete permission is not required because this connector exposes no delete tool.

## Environment variables

```text
DOCKER_HUB_USERNAME=
DOCKER_HUB_PAT=
DOCKER_HUB_ALLOWED_NAMESPACES=
DOCKER_HUB_ALLOWED_REPOSITORIES=
DOCKER_HUB_APPROVAL_SECRET=
DOCKER_HUB_TIMEOUT_MS=15000
DOCKER_HUB_MAX_RETRIES=3
DOCKER_HUB_MCP_ENABLED=true
DOCKER_HUB_MCP_COMMAND=node
DOCKER_HUB_MCP_ARGS_JSON=["/FULL/PATH/TO/docker-hub-mcp-server/dist/index.js","--transport=stdio"]
```

`DOCKER_HUB_ALLOWED_NAMESPACES` and `DOCKER_HUB_ALLOWED_REPOSITORIES` are comma-separated allowlists. Repository entries may be either `repository` or `namespace/repository`.

The official Docker Hub MCP repository documents authenticated stdio usage with `HUB_PAT_TOKEN` plus a `--username=...` argument. This connector keeps the PAT in the subprocess environment as `HUB_PAT_TOKEN` and automatically appends `--username=<DOCKER_HUB_USERNAME>` when a username is configured and the argument is not already present.

## Tools and permissions

READ tools:

- `dockerhub.search`
- `dockerhub.namespace.list`
- `dockerhub.repository.list`
- `dockerhub.repository.get`
- `dockerhub.repository.check`
- `dockerhub.tag.list`
- `dockerhub.tag.get`
- `dockerhub.tag.check`
- `dockerhub.hardened_image.list`

WRITE tools:

- `dockerhub.repository.create`
- `dockerhub.repository.update`

READ tools may execute without human approval, subject to provider permissions and connector allowlists. Every WRITE tool requires explicit approval.

## Approval model

`DOCKER_HUB_APPROVAL_SECRET` is an out-of-band connector secret. A caller supplies an `approvalId` equal to the lowercase hex HMAC-SHA256 of the exact tool name using that secret.

Bound write tool names:

```text
dockerhub.repository.create
dockerhub.repository.update
```

The approval secret is never exposed to the LLM. A separate trusted approval component should generate approval IDs after a human approves the specific operation.

## Validation and security

- Namespace, repository, and tag identifiers use constrained schemas.
- Repository and namespace allowlists are enforced before scoped upstream calls.
- Credentials are environment-only and isolated from tool parameters.
- No unrestricted URL or arbitrary provider-request tool exists.
- Provider content is returned as data and must be treated as untrusted content, not instructions.
- Upstream MCP startup or tool errors fail closed; only explicitly mapped API fallbacks are attempted.
- The REST base URL is fixed to `https://hub.docker.com/v2`, preventing caller-controlled SSRF targets.
- Write operations are not automatically retried.
- No destructive delete capability is registered.

## Reliability

REST reads use bounded exponential backoff for transient network failures, HTTP 429, and HTTP 5xx responses. `Retry-After` is honored when present. Retry count is capped by `DOCKER_HUB_MAX_RETRIES` (0-5).

The connector does not retry validation failures, permission failures, authentication failures requiring user action, or write requests. Requests are cancelled after `DOCKER_HUB_TIMEOUT_MS`.

The bearer token obtained from Docker Hub is cached briefly in-process; raw credentials remain in the credential layer.

## Rate limits

Docker documents an abuse rate limit across Hub properties and separate image pull limits. The abuse limit can return HTTP 429 and varies with load. Image pull limits are separate from the Hub metadata API operations exposed here. The REST client handles 429 using bounded retry and `Retry-After` when available, while callers should still avoid unnecessary pagination and polling.

## Pagination

Repository and tag list tools expose bounded `page` and `pageSize` inputs. Namespace pagination mirrors the official MCP schema, which currently represents `page` and `page_size` as strings. The connector does not automatically crawl all pages.

## Examples

See `examples/workflows.json` for reusable workflows with tool names, inputs, permission classification, approval requirements, and expected output shape.

## Testing

Unit tests require no live Docker Hub credentials:

```bash
npm test
npm run typecheck
```

Tests cover configuration validation, allowlist denial, approval enforcement, PAT-to-JWT credential isolation, bounded rate-limit retry, and no-retry behavior for writes.

## Client compatibility

This package is a standard stdio MCP server built with the official MCP TypeScript SDK. It can be used by MCP clients that support stdio server processes. No client-specific protocol extensions are required.

## Limitations

- Search, namespace discovery, existence checks, and Docker Hardened Image queries require the official Docker Hub MCP server because this connector does not invent undocumented REST fallbacks.
- Exact Docker Hub permissions still depend on the authenticated account, namespace membership, repository visibility, subscription, and token permissions.
- This connector manages Docker Hub metadata; it does not implement registry image push/pull or OCI manifest transfer.
- Webhooks, organization administration, token administration, billing, repository deletion, and destructive operations are deliberately outside this connector's scope.
