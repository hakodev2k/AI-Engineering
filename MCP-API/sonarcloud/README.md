# SonarQube Cloud MCP/API Connector

Reusable MCP connector for SonarQube Cloud code-quality and code-security workflows. The connector presents a narrow provider-scoped tool surface while preferring SonarSource's official SonarQube MCP Server and falling back to the official SonarQube Cloud Web API for supported operations when the upstream MCP process is unavailable.

## Official sources

- SonarQube MCP Server: https://docs.sonarsource.com/sonarqube-mcp-server
- MCP tools: https://docs.sonarsource.com/sonarqube-mcp-server/tools
- MCP quickstart / official Docker image `mcp/sonarqube`: https://docs.sonarsource.com/sonarqube-mcp-server/quickstart-guide
- MCP configuration and transports: https://docs.sonarsource.com/sonarqube-mcp-server/build-and-configure/configure
- SonarQube Cloud Web API: https://docs.sonarsource.com/sonarqube-cloud/advanced-setup/web-api
- SonarQube Cloud webhooks: https://docs.sonarsource.com/sonarqube-cloud/advanced-setup/webhooks

SonarSource documents an official MCP server for SonarQube Cloud and SonarQube Server. For SonarQube Cloud, connected mode requires a **user token** plus the organization key. SonarSource's official MCP container is `mcp/sonarqube`. The connector disables upstream MCP telemetry with `TELEMETRY_DISABLED=true`.

## Transport strategy

The external contract is always this connector's `sonarcloud.*` MCP tools. Callers do not need to know which upstream transport was used.

1. The connector first invokes the corresponding tool on SonarSource's official MCP server over stdio by launching the documented `mcp/sonarqube` container.
2. If the official MCP process cannot be used and the same capability is supported by the official Web API, the connector falls back to that API.
3. `sonarcloud.code.analyze` is MCP-only because the official MCP server supplies the analyzer capability; the connector does not invent a REST equivalent.

The fallback uses SonarQube Cloud Web API v1 endpoints documented by the service. SonarSource states that Web API v2 is gradually replacing v1, so endpoint compatibility should be checked during dependency/provider upgrades.

## Supported tools

| Tool | Purpose | Primary | Fallback | Risk | Approval |
| --- | --- | --- | --- | --- | --- |
| `sonarcloud.issue.search` | Search issues | official MCP | Web API | READ | no |
| `sonarcloud.issue.change_status` | Accept, mark false-positive, or reopen issue | official MCP | Web API | WRITE | configurable; required by default |
| `sonarcloud.hotspot.search` | Search security hotspots | official MCP | Web API | READ | no |
| `sonarcloud.hotspot.get` | Read hotspot details | official MCP | Web API | READ | no |
| `sonarcloud.hotspot.change_status` | Review or reopen a hotspot | official MCP | Web API | WRITE | configurable; required by default |
| `sonarcloud.webhook.list` | List org/project webhooks | official MCP | Web API | READ | no |
| `sonarcloud.webhook.create` | Create webhook | official MCP | Web API | HIGH_RISK | explicit approval + feature enable |
| `sonarcloud.code.analyze` | Analyze a code file/snippet | official MCP | unsupported | READ | no |

No arbitrary HTTP passthrough tool is exposed. Deleting webhooks, deleting projects, changing permissions, and administrative/billing operations are intentionally not implemented.

## Architecture

```text
MCP client / AI agent
        |
        v
sonarcloud.* stable tools
        |
        +--> policy + strict Zod validation
        |
        +--> official SonarQube MCP server (preferred)
        |       `mcp/sonarqube` over stdio
        |
        +--> SonarQube Cloud Web API fallback
                bearer token remains inside connector
```

Provider text and metadata are wrapped with `untrusted_data: true`. Retrieved issue descriptions, hotspot content, rule text, comments, and webhook metadata are data, not instructions.

## Authentication and least privilege

Set:

```text
SONARQUBE_TOKEN=
SONARQUBE_ORG=
```

Use a SonarQube Cloud **user token** for the official MCP server. The MCP documentation explicitly notes that project tokens, global tokens, and scoped organization tokens do not work for connected-mode/MCP binding. The same token is supplied to Web API fallback requests as:

```text
Authorization: Bearer <token>
```

The connector never emits the token in tool results, query strings, examples, or logs. Credentials are passed only into the official MCP child process and API authentication layer.

Permissions are ultimately enforced by SonarQube Cloud. Grant the authenticated user only the organizations/projects and administrative rights required for the enabled tools. Webhook creation requires Sonar administrator permission for the relevant organization/project according to provider policy.

## Environment variables

Copy `.env.example` and populate values through a secret manager or process environment.

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `SONARQUBE_TOKEN` | yes | none | SonarQube Cloud user token |
| `SONARQUBE_ORG` | yes | none | organization key |
| `SONARQUBE_URL` | no | `https://sonarcloud.io` | EU cloud host; use `https://sonarqube.us` for US |
| `SONARQUBE_MCP_IMAGE` | no | `mcp/sonarqube` | official MCP image |
| `SONARQUBE_REQUEST_TIMEOUT_MS` | no | `15000` | REST request timeout, 1s–120s |
| `SONARQUBE_REQUIRE_WRITE_APPROVAL` | no | `true` | require `approved=true` for WRITE operations |
| `SONARQUBE_ALLOW_WEBHOOK_WRITES` | no | `false` | separately enable webhook creation |
| `SONARQUBE_MCP_ENABLED` | no | `true` | allow official MCP transport; when false, only API fallbacks work |

`SONARQUBE_URL` is deliberately restricted to the official SonarQube Cloud EU and US hosts to prevent credential-forwarding SSRF.

## Installation

Requirements:

- Node.js 20+
- npm
- Docker or another setup exposing a `docker`-compatible command for the official container path
- access to a SonarQube Cloud organization

```bash
npm install
npm run build
npm test
npm start
```

The server uses stdio, so stdout is reserved for MCP protocol framing.

## MCP client configuration

Example local client configuration after building:

```json
{
  "mcpServers": {
    "sonarcloud": {
      "command": "node",
      "args": ["/absolute/path/to/MCP-API/sonarcloud/dist/src/server.js"],
      "env": {
        "SONARQUBE_TOKEN": "${SONARQUBE_TOKEN}",
        "SONARQUBE_ORG": "${SONARQUBE_ORG}",
        "SONARQUBE_URL": "https://sonarcloud.io"
      }
    }
  }
}
```

Exact environment-variable interpolation syntax varies by MCP client. Keep secrets in the client's secret/environment facility instead of storing literal values in committed configuration.

## Permission and approval model

`READ` tools may run automatically. `WRITE` tools require `approved=true` when `SONARQUBE_REQUIRE_WRITE_APPROVAL=true` (the default). `HIGH_RISK` webhook creation always requires `approved=true` and is additionally disabled until `SONARQUBE_ALLOW_WEBHOOK_WRITES=true`.

The `approved` field is not provider authorization. It is a connector-side evidence boundary indicating that the caller has already obtained the required human authorization. Agents must never set it speculatively.

Recommended workflow:

```text
Read -> Recommend -> Human review -> approved=true -> Execute
```

## Validation and security

- tool names are fixed and provider-scoped;
- Zod schemas bound strings, arrays, enums, and pagination sizes;
- SonarQube Cloud URL is restricted to official cloud hosts;
- webhook URLs must use HTTPS and basic loopback/private IPv4 SSRF targets are rejected;
- no tool can broaden credentials or permissions;
- no raw REST/MCP passthrough is exposed;
- non-idempotent writes are not blindly retried;
- provider-returned content is explicitly marked untrusted;
- MCP telemetry is disabled for the child server;
- credentials stay in the connector/auth layer and are never returned to the LLM.

For stronger webhook SSRF controls in high-assurance environments, enforce an outbound proxy or destination allowlist at the network layer as DNS can resolve public names to private addresses after validation.

## Reliability

REST calls have bounded request timeouts. Read-only API fallbacks may retry HTTP `429` up to two additional times with bounded backoff and respect a numeric `Retry-After` value when present. Write operations are attempted once and are never automatically retried.

Authentication, authorization, and validation errors are returned immediately. The connector maps upstream failures to MCP tool errors instead of treating them as successful data.

The official MCP client is opened lazily and reused across tool calls. It is closed on `SIGINT`/`SIGTERM`.

## Rate limits

SonarSource documents that some SonarQube Cloud APIs are rate-limited and return HTTP `429` when the limit is reached; the public documentation does not provide one universal numeric quota for every endpoint. Consumers should use pagination efficiently, narrow searches, and avoid repeated polling. The connector caps page size at 500 and implements bounded 429 handling for read API fallbacks.

## Webhooks

SonarQube Cloud webhooks are available according to provider plan/permission constraints. Provider documentation states they can notify external services after project analysis and when issue changes alter the quality-gate status. Webhook creation is therefore externally visible and classified `HIGH_RISK`.

## Error handling

Typical failures include:

- missing/expired token;
- token lacks Browse or administration permissions;
- incorrect organization/project key;
- Docker unavailable for the official MCP transport;
- official MCP tool unavailable in the installed image version;
- Web API `401`, `403`, `404`, or `429`;
- request timeout/network failure;
- malformed input or missing approval.

For capabilities with an API fallback, an MCP process failure transparently routes to the API. `sonarcloud.code.analyze` fails safely when the official MCP server cannot run.

## Testing

Normal unit tests need no live SonarQube credentials. They cover:

- required auth configuration;
- official cloud-host validation;
- read/write/high-risk policy enforcement;
- webhook URL validation;
- bearer-token placement and secret non-leakage;
- provider error mapping;
- prevention of blind retries for writes.

Run:

```bash
npm test
npm run check
```

Before production enablement, separately test against a non-critical SonarQube Cloud organization with real least-privilege credentials and verify provider permissions, MCP image compatibility, endpoint availability, and actual rate-limit behavior.

## Limitations

- This package targets **SonarQube Cloud**, not arbitrary self-hosted SonarQube Server instances.
- It does not create/delete projects, modify quality profiles/gates, alter users/permissions, or delete webhooks.
- `code.analyze` depends on the official MCP container and has no REST fallback.
- Some official MCP capabilities are intentionally omitted to keep the tool surface reviewable.
- Provider plans can affect availability of features such as webhooks and advanced analysis.
- Web API v1 endpoints may eventually be superseded by v2; upgrade reviews must compare implementation to current SonarSource docs.
