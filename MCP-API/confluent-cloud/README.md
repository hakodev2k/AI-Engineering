# Confluent Cloud MCP/API Connector

Reusable safety wrapper around Confluent Cloud's official **managed MCP servers**. It exposes a fixed provider-scoped MCP surface for infrastructure discovery, Kafka topic/schema inspection, connector diagnostics, metrics, and two approval-gated connector-management operations.

## Official sources researched

Research refreshed on 2026-09-10 from Confluent's current documentation:

- Managed MCP servers: https://docs.confluent.io/cloud/current/ai/ai-tools/managed-mcp-server.html
- AI tools overview: https://docs.confluent.io/cloud/current/ai/ai-tools/overview.html
- Open-source Confluent MCP server: https://docs.confluent.io/cloud/current/ai/ai-tools/open-source-mcp-server.html
- Confluent Cloud APIs: https://docs.confluent.io/cloud/current/api-docs/overview.html
- API authentication/API keys: https://docs.confluent.io/cloud/current/security/authenticate/workload-identities/service-accounts/api-keys/overview.html
- API rate limiting: https://docs.confluent.io/cloud/current/api.html/
- Kafka REST API v3: https://docs.confluent.io/cloud/current/kafka-rest/kafka-rest-cc.html
- Flink REST API: https://docs.confluent.io/cloud/current/flink/operate-and-deploy/flink-rest-api.html

Confluent made managed MCP servers generally available on May 19, 2026. The managed service is the preferred upstream here because the selected capabilities are already supported directly by Confluent and inherit Confluent Cloud RBAC.

## Transport decision

This connector uses Confluent's official managed MCP endpoints exclusively for its selected capability set:

- Global: `https://api.confluent.cloud/mcp/v1`
- Regional: `https://mcp.<region>.<cloud>.confluent.cloud/mcp/v1/organizations/<org_id>`

The global server covers environments, clusters, connector inspection/diagnostics/management, and metrics. The regional server covers Kafka topics, sample messages, and Schema Registry subjects.

Confluent also provides the self-hosted `@confluentinc/mcp-confluent` server with 50+ read/write tools and REST APIs for Kafka, Flink, resource management, and metrics. Those alternatives were checked, but no API fallback is necessary for the 20 capabilities implemented below. Avoiding a redundant fallback also prevents ambiguous write replay when a managed-MCP mutation has an uncertain outcome.

## Architecture

```text
MCP client / AI agent
        |
        v
this connector (stdio)
  - fixed provider-scoped allowlist
  - official-schema discovery
  - AJV input validation
  - risk / approval policy
  - bounded timeout + read-only retries
  - credential isolation
        |
        +--> Confluent managed global MCP
        |
        `--> Confluent managed regional MCP
```

The connector calls `tools/list` against the official server and reuses the current upstream input schema for each allowlisted capability. It makes the schema strict (`additionalProperties: false`) and adds an approval field only to high-risk operations. Missing expected global tools cause startup to fail closed. Newly discovered Confluent tools are not exposed automatically.

## Authentication

Confluent managed MCP uses HTTP Basic authentication with a Confluent API key and secret.

Set:

```text
CONFLUENT_API_KEY=
CONFLUENT_API_SECRET=
```

The credentials remain inside the connector transport and are sent only in the upstream `Authorization` header. They never appear in tool schemas, tool arguments, tool results, or normal logs.

### Key choice and least privilege

Confluent currently documents these managed-MCP key choices:

- **Global API key**: supported by both global and regional MCP servers and recommended when both are needed.
- **Cloud API key**: supported by the global server only.
- **Flink API key**: supported by the regional server only.

Confluent RBAC remains authoritative. Provision a dedicated service account and grant only the roles needed for the environments, clusters, connectors, topics, schemas, and metrics the agent should access. Do not use broad global keys when a global-only Cloud key is sufficient.

## Regional configuration

Regional capabilities require all three variables:

```text
CONFLUENT_CLOUD_PROVIDER=aws
CONFLUENT_CLOUD_REGION=us-east-1
CONFLUENT_ORGANIZATION_ID=<organization-id>
```

`CONFLUENT_CLOUD_PROVIDER` is restricted to `aws`, `gcp`, or `azure`; region and organization identifiers are validated and the URL is derived locally. Agents cannot supply or override upstream URLs, reducing SSRF and credential-forwarding risk.

If regional coordinates are omitted, the connector runs with the reviewed global tool surface only.

## Runtime and installation

Requirements:

- Node.js 20+
- npm

Install, compile, test, and run:

```bash
npm install
npm run build
npm test
npm start
```

The connector itself serves MCP over stdio and can be launched by any MCP host that supports local stdio servers. Compatibility depends on the host's standard MCP support; no proprietary client behavior is required.

## Implemented tool catalog

| Connector tool | Official managed MCP tool | Scope | Risk | Approval |
|---|---|---|---|---|
| `confluent.environment.list` | `list_environments` | global | READ | no |
| `confluent.environment.get` | `read_environment` | global | READ | no |
| `confluent.cluster.list` | `list_clusters` | global | READ | no |
| `confluent.cluster.get` | `read_cluster` | global | READ | no |
| `confluent.connector.list` | `list_connectors` | global | READ | no |
| `confluent.connector.config.get` | `get_connector_config` | global | READ | no |
| `confluent.connector.status.get` | `get_connector_status` | global | READ | no |
| `confluent.connector.logs.get` | `get_connector_logs` | global | READ | no |
| `confluent.connector.offsets.get` | `get_connector_offsets` | global | READ | no |
| `confluent.connector.metrics.get` | `get_connector_metrics` | global | READ | no |
| `confluent.connector.error_summary.get` | `get_connector_error_summary` | global | READ | no |
| `confluent.connector.restart` | `restart_connector` | global | HIGH_RISK | always |
| `confluent.connector.config.update` | `update_connector_config` | global | HIGH_RISK | always |
| `confluent.metric.list` | `list_metrics` | global | READ | no |
| `confluent.metric.query` | `query_metrics` | global | READ | no |
| `confluent.topic.list` | `list_kafka_topics` | regional | READ | no |
| `confluent.topic.describe` | `describe_kafka_topic` | regional | READ | no |
| `confluent.topic.message.sample` | `consume_kafka_messages` | regional | READ | no |
| `confluent.schema.subject.list` | `list_schema_subjects` | regional | READ | no |
| `confluent.schema.subject.get` | `read_schema_subject` | regional | READ | no |

Confluent's managed MCP also exposes `get_connector_fix_recommendations`. This connector intentionally omits it because the primary workflow can already inspect deterministic status/log/offset/metric data plus the error summary; keeping the allowlist at 20 tools avoids automatically widening the agent surface. The upstream recommendation capability can be reviewed separately later.

## Human approval and risk model

READ tools may execute automatically after provider-side authorization succeeds.

`confluent.connector.restart` and `confluent.connector.config.update` are `HIGH_RISK` because they change live connector runtime/configuration and may affect production data movement. They are disabled unless:

```text
CONFLUENT_ENABLE_WRITES=true
CONFLUENT_APPROVAL_SECRET=<operator-held-secret>
```

Each call must additionally contain `approval_token`, a 64-character lowercase HMAC-SHA256 digest bound to the **exact external tool name and exact canonical payload**. The approval secret belongs in a trusted human-approval service or operator environment, never in the model context.

Changing the connector identifier, configuration fields, or any other argument invalidates approval. The wrapper strips `approval_token` before forwarding the provider call.

No destructive tool, cluster/topic creation/deletion, ACL mutation, service-account management, API-key management, billing mutation, or unrestricted request proxy is exposed.

## Validation

The managed MCP server remains authoritative for provider schemas. This wrapper additionally:

- discovers only the fixed allowlisted upstream names;
- converts every input object to strict `additionalProperties: false` form;
- validates calls locally with AJV before forwarding;
- rejects unknown or unavailable tools;
- validates regional URL components locally;
- never accepts credentials or arbitrary upstream URLs as tool inputs.

This lets Confluent evolve supported argument fields while preventing the wrapper from silently trusting newly added tools.

## Reliability, timeouts, retries, and rate limits

Every upstream connect/tool operation has a configurable timeout:

```text
CONFLUENT_TIMEOUT_MS=20000
```

Read-only operations may retry bounded transient failures up to `CONFLUENT_MAX_READ_RETRIES` additional attempts (default 2, maximum 5), with exponential backoff. Retry classification is limited to throttling/rate-limit signals, timeout, and common transient 502/503/504 failures.

High-risk writes are attempted **once only**. They are never blindly retried, preventing a connector restart or configuration mutation from being repeated after an ambiguous failure.

Confluent documents HTTP `429 Too Many Requests` for Cloud APIs and returns rate-limit metadata including `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, and `Retry-After` on many API families. Managed MCP limits match underlying Confluent Cloud API limits. The connector does not invent a universal numeric quota because limits vary by API/resource. Callers should reduce polling and respect provider retry guidance.

For reference, Confluent currently documents the Flink REST API at 1,000 requests/minute, 50 requests/second, and 100 concurrent connections per IP, but this connector does not call Flink REST directly and therefore does not apply that number to managed MCP traffic.

## Pagination and data minimization

Pagination and bounds are defined by Confluent's current managed-MCP schemas and are validated locally. The wrapper does not automatically crawl all pages or fan out hidden calls.

`confluent.topic.message.sample` follows Confluent's managed MCP behavior of reading only one to ten sample messages. Kafka message values can contain personal, confidential, or regulated data; request the smallest useful sample and apply the MCP host's data-handling policy.

## Error handling

- Missing credentials fail at startup.
- Partial regional configuration fails at startup.
- Missing expected global MCP capabilities fail startup.
- Invalid arguments fail locally before provider execution.
- Authentication/permission failures are not classified for blind retry.
- High-risk calls are never retried.
- Returned error strings redact the configured API key and secret if an upstream library includes them unexpectedly.
- Provider responses are wrapped with `trust: "untrusted_provider_data"`.

## Security considerations

- **Credential isolation:** keys remain inside the connector's transport layer.
- **SSRF resistance:** global URL is fixed; regional URL is derived from validated provider/region/org values.
- **No arbitrary proxy:** there is no raw HTTP request or generic MCP-tool executor.
- **Fixed tool allowlist:** newly discovered tools do not become agent-accessible automatically.
- **Prompt injection:** topic messages, connector logs/configuration, schemas, metric labels, error summaries, and every other provider response are untrusted data, never instructions that can alter connector policy.
- **Permission escalation:** no MCP call can modify the connector's environment, approval secret, key scopes, or RBAC roles.
- **Writes:** restart/config-update require a default-off environment gate plus exact-payload human approval.
- **Sensitive connector configuration:** upstream connector config may contain secret-oriented fields depending on connector type. Downstream hosts should redact/minimize such output and must never copy secrets into prompts unnecessarily.
- **Auditability:** Confluent documents managed-MCP tool calls in Cloud audit logs with `mcp.tools/call.<tool-name>` attribution to the authenticated principal.

## Managed MCP versus open-source MCP/API fallback

Confluent's managed MCP is generally available and is the trusted first choice for this connector. Its current limitations are intentional: it cannot create/delete connectors or create/change/delete clusters/topics; it primarily reads resources plus supports connector restart and connector configuration update.

Confluent's open-source MCP server supports a broader read/write surface, including Kafka resource mutation, Flink SQL, connectors, schemas, Tableflow, billing, and more. It is Confluent-published but community-supported/best-effort. This connector does not proxy that broader surface because the selected workflows are already covered by the managed service and narrower authority is safer for general agents.

Official REST APIs remain a future fallback option when a required capability is genuinely absent from managed MCP. Any such addition should be implemented as a specific provider-scoped tool, use least-privilege credentials, preserve approval semantics, and never replay ambiguous MCP writes through REST.

## Testing

Normal tests require no live Confluent credentials:

```bash
npm test
```

The suite covers:

- required authentication configuration;
- regional endpoint validation/derivation;
- credential placement in Basic auth;
- exactly 20 provider-scoped capability bindings;
- read permission behavior;
- default denial of high-risk writes;
- exact-payload HMAC approval and mutation invalidation;
- strict schema augmentation;
- construction against a fake reviewed global upstream inventory.

The transport is injected behind an `Upstream` interface so additional tests can simulate MCP throttling, timeout, authentication failure, schema drift, and regional availability without live credentials.

## Usage examples

See `examples/workflows.md` for infrastructure discovery, connector diagnosis, approved restart/configuration changes, regional topic/schema inspection, sample-message reading, and metric queries.

## Limitations

- The wrapper implements Basic API-key authentication. It does not create/rotate API keys or implement external IdP OAuth token exchange.
- Regional tools require a region where Confluent's managed regional MCP is available; private-network clusters require Confluent's separately configured private regional MCP path and support enablement, which this public-host wrapper intentionally does not auto-configure.
- If regional configuration is omitted, regional tools are not registered.
- The wrapper does not expose Flink SQL, Tableflow, connector creation/deletion, topic mutation, schema deletion, ACL mutation, billing, or IAM administration.
- Confluent's provider-side roles, plan entitlements, resource networking, and API-key type remain authoritative.
- Provider schemas can evolve. The wrapper refreshes schemas at process startup and fails closed for missing reviewed global capabilities.
