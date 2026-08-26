# Snyk MCP/API Connector

Reusable Model Context Protocol connector for Snyk security workflows. It exposes a stable provider-scoped MCP interface while routing each capability to the most appropriate official Snyk transport.

## Transport strategy

The connector uses the official local Snyk MCP server, distributed with the Snyk CLI, for local security scanning. Snyk documents `snyk mcp -t stdio` as the recommended local transport and also supports local SSE. The connector deliberately uses stdio so credentials and local filesystem access stay inside the Snyk CLI process.

The connector uses Snyk's official REST API for organization, project, issue, and project-SBOM retrieval because these are account/platform data operations rather than local source-tree scans.

Official sources researched for this implementation:

- Snyk Studio / MCP supported tools: https://docs.snyk.io/integrations/snyk-studio-agentic-integrations
- Snyk Studio setup: https://docs.snyk.io/integrations/snyk-studio-agentic-integrations/getting-started-with-snyk-studio
- Snyk API authentication: https://docs.snyk.io/snyk-api/authentication-for-api
- REST API conventions and regional URLs: https://docs.snyk.io/snyk-api/rest-api/about-the-rest-api
- REST getting started and API versioning guidance: https://docs.snyk.io/snyk-api/rest-api/getting-started-with-the-rest-api
- Projects API: https://docs.snyk.io/snyk-api/reference/projects
- Issues API: https://docs.snyk.io/snyk-api/reference/issues
- Organizations API: https://docs.snyk.io/snyk-api/reference/orgs
- Project SBOM API: https://docs.snyk.io/snyk-api/using-specific-snyk-apis/sbom-apis/rest-api-get-a-projects-sbom-document
- AI-BOM CLI behavior: https://docs.snyk.io/developer-tools/snyk-cli/commands/aibom

## Implemented tools

| Tool | Transport | Risk | Approval | Purpose |
|---|---|---|---|---|
| `snyk.org.list` | REST | READ | No | List organizations accessible to the credential |
| `snyk.project.list` | REST | READ | No | List organization projects with cursor pagination |
| `snyk.project.get` | REST | READ | No | Get project metadata and latest issue/dependency counts |
| `snyk.issue.list` | REST | READ | No | List organization issues with cursor pagination |
| `snyk.issue.get` | REST | READ | No | Get one issue by UUID |
| `snyk.project.sbom.get` | REST | READ | No | Export a Snyk project SBOM |
| `snyk.scan.sca` | official Snyk MCP | HIGH_RISK | Yes | Scan local manifests/dependencies for vulnerabilities and license issues |
| `snyk.scan.code` | official Snyk MCP | HIGH_RISK | Yes | Run Snyk Code SAST on a local path |
| `snyk.scan.iac` | official Snyk MCP | HIGH_RISK | Yes | Scan supported IaC files for misconfiguration |
| `snyk.scan.container` | official Snyk MCP | HIGH_RISK | Yes | Scan a container image |
| `snyk.scan.sbom` | official Snyk MCP | HIGH_RISK | Yes | Scan an existing SBOM file |
| `snyk.aibom.create` | official Snyk MCP | HIGH_RISK | Yes | Generate a local Python project's AI-BOM |

The connector does not expose Snyk MCP authentication, logout, trust-management, feedback, or arbitrary upstream tool execution. The upstream MCP client validates the discovered tool set and allows only the six explicitly listed scan/AI-BOM tools.

## Architecture

```text
MCP client / AI agent
        |
        v
Snyk connector MCP server
        |
        +-- READ platform queries --> Snyk REST API
        |
        +-- approved local scans --> allowlisted official Snyk MCP server
                                      (Snyk CLI, stdio)
```

Raw credentials never appear in MCP tool inputs or outputs. `SNYK_TOKEN` is read from the connector process environment and is injected only into the REST Authorization header and the child Snyk CLI environment.

Third-party content returned by Snyk is wrapped with `untrustedProviderContent: true`. Callers must treat findings, project names, dependency metadata, file content references, and other provider material as data rather than instructions.

## Requirements

- Node.js 20 or newer.
- Snyk CLI with MCP support for local scan tools. Snyk recommends current CLI releases; Snyk MCP is included in the CLI and documented for current 1.1298+ releases.
- A Snyk credential usable for the required API/CLI operations.
- Network access to the configured Snyk regional API.
- For some SCA scans, local package ecosystem tools such as Maven or Gradle may be invoked by Snyk to resolve dependency trees.

## Authentication and permissions

Set `SNYK_TOKEN` to a Snyk personal API token/PAT appropriate for your plan and required operations. The REST transport sends it as:

```text
Authorization: token <secret>
```

Snyk Apps use bearer access tokens, but this connector intentionally implements the user/service token model and does not silently switch authentication modes.

Minimum documented platform permissions for the implemented read operations include:

- `org.read` for organization context and issue access where required.
- `org.project.read` for projects and issue access.
- `org.project.snapshot.read` for organization issue retrieval where required by Snyk.

Permissions remain enforced by Snyk. The connector cannot grant or elevate them. Free/Team plan credential limitations documented by Snyk still apply.

## Environment variables

Copy `.env.example` into your secret-management workflow; do not commit populated credentials.

- `SNYK_TOKEN` — required secret.
- `SNYK_ORG_ID` — optional default organization UUID.
- `SNYK_REST_BASE_URL` — defaults to `https://api.snyk.io/rest`; configure the correct regional endpoint such as `https://api.eu.snyk.io/rest` when required.
- `SNYK_API_VERSION` — defaults to `2024-10-15`, Snyk's recommended stable baseline for general REST use.
- `SNYK_CLI_PATH` — defaults to `snyk`.
- `SNYK_APPROVAL_SECRET` — at least 16 characters; required to execute HIGH_RISK tools.
- `SNYK_TIMEOUT_MS` — REST timeout, 1,000–120,000 ms; default 30,000.
- `SNYK_MAX_RETRIES` — bounded REST retries, 0–5; default 2.

## Installation

```bash
npm install
npm run build
```

Ensure the official Snyk CLI is installed and authenticated/configured for the intended organization or provide `SNYK_TOKEN` through the connector environment.

## Running the MCP server

```bash
npm start
```

The external connector itself speaks MCP over stdio. A compatible client can configure the built `dist/src/server.js` process as a local MCP server. Compatibility depends on the client supporting standard MCP stdio servers; no provider-specific client integration is required.

## Human approval model

Read-only REST tools can execute automatically after normal schema validation.

Local Snyk MCP scans are classified `HIGH_RISK`, not because the scan is intended to modify Snyk data, but because it reads caller-selected local filesystem paths and Snyk documents that dependency scanning can invoke ecosystem tooling such as Maven or Gradle. A compromised build file or repository can therefore create local execution risk.

Before a HIGH_RISK tool is executed, the caller must supply an `approvalId` equal to a SHA-256 HMAC over the exact tool name and exact payload using `SNYK_APPROVAL_SECRET`. This binds approval to the requested operation. An approval generated for one path, image, or tool cannot authorize another.

No destructive Snyk operations are implemented. Authentication, logout, trust changes, project deletion, policy changes, permission changes, billing actions, and arbitrary API calls are intentionally absent.

## Validation and safety

- UUIDs are validated for organization, project, and issue identifiers.
- Page limits are restricted to Snyk's documented 10–100 range for the REST resources used here.
- Filesystem path strings and image references have bounded lengths.
- SBOM output format is an enum rather than arbitrary query input.
- Regional API base URL is configuration, never supplied by an agent tool call, reducing SSRF exposure.
- Upstream Snyk MCP tools are allowlisted and re-verified after MCP discovery.
- Credentials are isolated inside the connector and are not accepted as MCP parameters.
- Provider responses are labeled untrusted.
- High-risk approvals are payload-bound and compared in constant time.

## Reliability and rate limiting

REST calls use `AbortController` timeouts and bounded exponential backoff. The connector retries only transient classes: HTTP 408, HTTP 429, HTTP 5xx, and retryable network failures. It does not retry 401/403 permission or authentication failures.

When Snyk returns `Retry-After`, the connector preserves that delay for 429 handling. It also preserves Snyk's `x-error-reference` value on `SnykApiError` for troubleshooting. Snyk documents a default V1 API limit of 2,000 requests/minute, with endpoint-specific lower limits; REST limits can differ by endpoint/plan, so callers must also respect server-provided throttling responses.

Pagination is exposed through a bounded `limit` and `starting_after` cursor. The connector returns Snyk's JSON:API pagination links rather than recursively downloading every page, avoiding uncontrolled request amplification.

## Error handling

Provider validation errors, authentication failures, authorization failures, missing resources, rate limits, and server failures are surfaced as MCP errors without leaking credentials. REST error details are reduced to provider error detail/message text. Network and timeout failures are bounded by configured retries.

The official upstream Snyk MCP server is treated as a trusted transport but not as an unrestricted capability source: missing expected tools causes the upstream MCP connection to fail safely, and newly discovered tools are never automatically exposed.

## Testing

Unit tests require no live Snyk credentials:

```bash
npm test
```

Tests cover configuration validation, risk classification, payload-bound approval denial/acceptance, REST authentication headers, API version propagation, 429 retry behavior, pagination response preservation, and non-retry of authorization failures.

## Limitations

- Snyk MCP is local rather than a hosted remote server; the connector therefore requires a Snyk CLI installation on the same host.
- Local scan behavior and supported ecosystems depend on the installed Snyk CLI and the customer's Snyk product entitlements.
- `snyk_sbom_scan` and `snyk_aibom` are documented by Snyk as experimental/feature-dependent capabilities and may change upstream.
- AI-BOM local generation currently has documented Python-project requirements and feature constraints.
- This connector intentionally omits write/destructive account operations, Snyk authentication/logout tools, folder trust mutation, project deletion, issue ignore changes, integrations, billing, policy administration, and unrestricted API proxying.
- Project SBOM availability and formats depend on Snyk plan/API support. The connector restricts formats to common documented JSON SBOM variants.

See `examples/workflows.md` for concrete calls and approval expectations.
