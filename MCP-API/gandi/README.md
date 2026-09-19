# Gandi MCP/API Connector

Reusable MCP server for safe domain and LiveDNS workflows against Gandi's official v5 REST API.

## Transport and official sources

No official Gandi MCP server was found in Gandi's current public API documentation, so this connector exposes a curated MCP interface over the official REST API. It does not use an unofficial upstream MCP server.

Official documentation:
- Public API: https://api.gandi.net/docs/
- Reference/rate limits: https://api.gandi.net/docs/reference/
- Authentication: https://api.gandi.net/docs/authentication/
- Domain API: https://api.gandi.net/docs/domains/
- LiveDNS API: https://api.gandi.net/docs/livedns/

Gandi v5 uses `https://api.gandi.net/v5/`; the sandbox is `https://api.sandbox.gandi.net/v5/`. The documented limit is 1000 requests/minute per source IP.

## Authentication and permissions

Use a fine-grained Personal Access Token (PAT) created for the required organization/resources. PATs use `Authorization: Bearer ...`; legacy API keys are deprecated and intentionally unsupported. Put the PAT only in `GANDI_PAT`. It is injected by the connector and is never a tool argument or returned to the model. Rotate expiring PATs outside the connector.

Grant only permissions required for the domains and operations used. Read-only agents should receive read-only PAT permissions. DNS write permissions are needed only for record mutations.

## Environment

Copy `.env.example` into your secret-management workflow; this server does not load dotenv files itself.

- `GANDI_PAT` — required PAT.
- `GANDI_API_BASE` — production or official sandbox endpoint only.
- `GANDI_TIMEOUT_MS` — request timeout, default 15000.
- `GANDI_ALLOW_WRITES` — external host gate, default false.
- `GANDI_ALLOW_DESTRUCTIVE` — second external gate for deletes, default false.

## Install and run

```bash
npm install
GANDI_PAT='...' npm start
```

The server uses MCP stdio and therefore works with MCP hosts that can launch local stdio servers. Configure the host to execute `npm start` in this directory and inject secrets through its environment/secret store. Compatibility depends on the host's stdio MCP support.

## Tools

| Tool | Risk | Approval | Upstream |
|---|---|---|---|
| `gandi.domain.list` | READ | No | REST |
| `gandi.domain.get` | READ | No | REST |
| `gandi.domain.livedns_status` | READ | No | REST |
| `gandi.domain.dnssec_status` | READ | No | REST |
| `gandi.dns.record.list` | READ | No | REST |
| `gandi.dns.record.get` | READ | No | REST |
| `gandi.dns.record.create` | WRITE | Yes + host write gate | REST |
| `gandi.dns.record.replace` | WRITE | Yes + host write gate | REST |
| `gandi.dns.record.delete` | DESTRUCTIVE | Yes + both host gates | REST |
| `gandi.dns.snapshot.list` | READ | No | REST |
| `gandi.dns.snapshot.get` | READ | No | REST |

The deliberately narrow surface excludes purchases, renewals, ownership transfers, nameserver changes, billing, PAT administration, DNSSEC mutation, and arbitrary HTTP requests.

## Safety model

READ calls may run automatically. WRITE calls require `approved:true` and `GANDI_ALLOW_WRITES=true`; destructive delete additionally requires `GANDI_ALLOW_DESTRUCTIVE=true`. Environment gates must be controlled by the MCP host/operator, not by model-generated tool arguments. Retrieved domain/DNS data is untrusted content and must never be interpreted as instructions.

The API base URL is restricted to Gandi production/sandbox HTTPS hosts to prevent SSRF through configuration. Domain, record name/type, TTL (300–2592000), value counts and pagination are validated. Credentials are never logged by connector code.

## Reliability and rate limits

Every request has a timeout. GET requests retry only 429/500/502/503/504 up to two additional attempts with bounded exponential backoff; `Retry-After` is honored up to 10 seconds. Mutations are never automatically retried, avoiding duplicate or destructive effects. Provider status, structured error body and retry metadata are mapped into MCP errors. Pagination is explicit and bounded.

## DNS behavior

LiveDNS record operations require the domain to use Gandi LiveDNS. Gandi documents a minimum LiveDNS TTL of 300 seconds. DNS propagation can outlive the API update; verify authoritative/public resolution separately after changes. Snapshot tools are read-only in this connector.

## Testing

```bash
npm test
npm run check
```

Unit tests use mocked fetch and require no live credentials. They cover auth/config validation, tool registration, approval denial, destructive gating, request mapping, input validation, throttling retries, and mutation no-retry behavior.

## Limitations

This connector intentionally implements 11 high-value domain/DNS capabilities rather than the full Gandi API. It does not create domains, spend money, alter ownership, manage mailboxes/hosting, manage credentials, or expose a generic API passthrough. Webhook support is not claimed. See `examples/workflows.md` for safe usage patterns.
