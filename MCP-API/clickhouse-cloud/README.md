# ClickHouse Cloud MCP/API Connector

Read-only, reusable MCP connector for ClickHouse Cloud. It combines ClickHouse's official `mcp-clickhouse` server for data-plane discovery/querying with the official ClickHouse Cloud REST API for control-plane inventory such as services, ClickPipes, backups, and Managed ClickStack metadata.

## Official sources researched

- Official MCP server: https://github.com/ClickHouse/mcp-clickhouse
- ClickHouse Cloud managed MCP / agentic analytics: https://clickhouse.com/blog/clickhouse-cloud-joins-aws-ai-agents-and-tools-mcp and https://clickhouse.com/blog/agentic-analytics-ask-ai-agent-and-remote-mcp-server-beta-launch
- ClickPipes OpenAPI: https://clickhouse.com/blog/terraform-ga
- ClickStack Cloud API: https://clickhouse.com/blog/clickstack-api
- Cloud API key/auth examples: https://clickhouse.com/blog/clickstack-terraform-provider
- Official agent-oriented CLI/auth model: https://clickhouse.com/blog/introducing-clickhousectl-official-cli-for-clickhouse-local-and-cloud

ClickHouse's official MCP server currently exposes `run_query`, `list_databases`, and `list_tables` for ClickHouse connections. It defaults queries to read-only and can be explicitly configured with `CLICKHOUSE_ALLOW_WRITE_ACCESS=false`; this connector always forces that setting. ClickHouse Cloud also has managed remote MCP capabilities with OAuth, but the connector uses the official local MCP package because it gives deterministic credential isolation for headless runtimes and avoids storing delegated OAuth refresh state.

## Implemented tools

| Tool | Transport | Risk |
|---|---|---|
| `clickhouse.database.list` | official MCP | READ |
| `clickhouse.table.list` | official MCP | READ |
| `clickhouse.query.run_readonly` | official MCP | READ |
| `clickhouse.cloud.service.list` | Cloud REST | READ |
| `clickhouse.cloud.service.get` | Cloud REST | READ |
| `clickhouse.cloud.clickpipe.list` | Cloud REST | READ |
| `clickhouse.cloud.clickpipe.get` | Cloud REST | READ |
| `clickhouse.cloud.backup.list` | Cloud REST | READ |
| `clickhouse.cloud.backup.get` | Cloud REST | READ |
| `clickhouse.cloud.backup_configuration.get` | Cloud REST | READ |
| `clickhouse.cloud.clickstack.source.list` | Cloud REST | READ |
| `clickhouse.cloud.clickstack.webhook.list` | Cloud REST | READ |

This connector intentionally exposes no write or destructive tools. Creating/scaling/deleting services, changing ClickPipes, changing ClickStack configuration, and other control-plane mutations are valid provider capabilities but require API-key write access and can materially affect availability or cost. They are outside this connector's least-privilege surface.

## Architecture

`MCP client -> connector -> allowlisted tool -> official mcp-clickhouse OR api.clickhouse.cloud`

The model never receives raw Cloud API credentials or ClickHouse database passwords. REST URLs are fixed to `https://api.clickhouse.cloud`; provider resource IDs are validated and encoded, so callers cannot turn these tools into arbitrary HTTP/SSRF primitives. MCP tool discovery is checked at startup and unknown upstream tools are never auto-exposed.

## Authentication and permissions

Cloud REST uses the provider-documented API key ID + API key secret via HTTP Basic authentication. Create the key at the organization level and grant read-only/service-scoped access whenever possible. ClickHouse's official CLI documentation distinguishes browser OAuth read-only access from API-key access for mutations; because this connector performs only REST reads, use a read-only Cloud API key.

The data-plane MCP process uses a normal ClickHouse user/password. Give that account a read-only role and only the databases/tables the agent needs. `CLICKHOUSE_ALLOW_WRITE_ACCESS=false` is injected regardless of caller input.

## Environment

See `.env.example`. Required: `CLICKHOUSE_CLOUD_API_KEY`, `CLICKHOUSE_CLOUD_API_SECRET`, `CLICKHOUSE_CLOUD_ORG_ID`, `CLICKHOUSE_HOST`, and `CLICKHOUSE_PASSWORD`. Optional settings control database, user, TLS verification, port, role, and bounded timeouts.

## Installation

Node.js 20+ and `uv` are required. The official MCP server is launched with:

```bash
uv run --with mcp-clickhouse --python 3.10 mcp-clickhouse
```

Install/build this wrapper:

```bash
cd MCP-API/clickhouse-cloud
npm install
npm run build
```

## Running

```bash
npm start
```

The external connector uses MCP stdio and can be launched by MCP clients that support stdio child servers. See `examples/mcp-client.json`.

## Pagination

`clickhouse.table.list` preserves the official MCP server's `page_token`, `page_size`, `like`, `not_like`, and `include_detailed_columns` contract. Callers should follow `next_page_token` rather than issuing broad repeated scans. Cloud REST responses are returned without synthesizing hidden follow-up requests; if the provider supplies pagination links/cursors, callers can narrow the query or a future explicitly scoped tool can expose them.

## Reliability and rate limits

- MCP and REST calls have separate bounded timeouts.
- REST 401, 403, and 429 responses are mapped to actionable connector errors.
- `Retry-After` is preserved in throttling errors when ClickHouse supplies it.
- No mutation is implemented, so the connector never performs unsafe automatic write retries.
- Provider responses are wrapped/labelled as untrusted data and must never be interpreted as tool instructions or permission changes.

## Security

- Credentials stay in the auth/transport layer and are not returned in tool output.
- TLS is enabled and certificate verification defaults to true.
- The Cloud host is hard-coded and paths are allowlisted; there is no arbitrary URL/request tool.
- Database query execution is delegated to the official ClickHouse MCP server with write access disabled.
- Service/log/data content is untrusted and cannot expand the connector's tool set.
- No secret-management, IAM mutation, service deletion, service scaling, ClickPipe mutation, or billing mutation tool is exposed.

## Tests

```bash
npm test
```

Unit tests need no live credentials. They verify secure configuration defaults, credential validation, tool registration, provider scoping, fixed-host Basic authentication, identifier validation, and 429 `Retry-After` handling.

## Limitations

- This package is intentionally read-only; it does not expose valid ClickHouse Cloud write APIs.
- Managed remote MCP OAuth is not embedded. The official local `mcp-clickhouse` server is used for the data plane.
- Cloud REST endpoint availability can vary by product/plan. ClickStack tools require a Managed ClickStack-enabled service and adequate API-key permissions.
- The connector does not return or expose database connection secrets from Cloud control-plane APIs.
