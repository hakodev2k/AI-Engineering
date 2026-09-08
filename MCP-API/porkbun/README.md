# Porkbun MCP/API Connector

Reusable, security-focused MCP connector for Porkbun domain and DNS workflows. The connector exposes a stable provider-scoped MCP stdio interface and delegates only an explicit allowlist of capabilities to Porkbun's official first-party MCP server.

Research baseline: **2026-09-08**.

## Official sources researched

- Porkbun API v3 documentation: https://porkbun.com/api/json/v3/documentation
- Porkbun interactive API reference / OpenAPI links: https://porkbun.com/api/json/v3/documentation/interactive
- Porkbun official MCP server: https://porkbun.com/mcp
- Porkbun official MCP source: https://github.com/oborseth/Porkbun-MCP
- Porkbun API-key management: https://porkbun.com/account/api
- Porkbun DNS product/API-access guidance: https://porkbun.com/products/dns_management

At the research date, Porkbun documents API **v3.19** and the official local MCP server as **v0.22.2 with 81 tools**. The official MCP package is `@porkbunllc/mcp-server` and runs locally over stdio with Node.js 18+. This connector requires Node.js 20+.

## Transport strategy

Required capabilities are all available through Porkbun's official MCP server, so this connector uses MCP rather than rebuilding those operations against REST.

```text
AI / MCP client
  -> this connector (stdio MCP)
  -> strict schema + risk / approval policy
  -> fixed upstream-tool allowlist
  -> official @porkbunllc/mcp-server (stdio MCP)
  -> Porkbun API v3
```

The connector discovers the upstream tool set during connection and fails closed if any required official tool is missing. Newly discovered upstream tools are never automatically trusted. There is no raw REST request tool and no generic MCP passthrough.

Porkbun's official MCP server automatically attaches idempotency keys to write tools. Porkbun also documents API-level `Idempotency-Key` support for writes, a 24-hour replay window, `dryRun` support for billable/destructive API operations, per-key domain/IP scoping, sandbox keys, spend controls, stable machine-readable errors, and `X-RateLimit-*` signalling.

## Implemented tools

| Connector tool | Official upstream tool | Risk | Approval |
|---|---|---:|---|
| `porkbun.connectivity.ping` | `ping` | READ | none |
| `porkbun.domain.check` | `check_domain` | READ | none |
| `porkbun.pricing.get` | `get_pricing` | READ | none |
| `porkbun.domain.list` | `list_domains` | READ | none |
| `porkbun.domain.get` | `get_domain` | READ | none |
| `porkbun.nameserver.get` | `get_nameservers` | READ | none |
| `porkbun.dns.record.list` | `list_dns_records` | READ | none |
| `porkbun.dns.record.create` | `create_dns_record` | WRITE | required by default |
| `porkbun.dns.record.update` | `update_dns_record` | WRITE | required by default |
| `porkbun.dns.record.delete` | `delete_dns_record` | DESTRUCTIVE | always + disabled by default |
| `porkbun.nameserver.update` | `update_nameservers` | HIGH_RISK | always |

This is intentionally narrower than Porkbun's full 81-tool MCP surface. Domain registration/renewal/transfer, account balance/spend controls, contacts, SSL private-key retrieval, hosting, WordPress credentials, Cloudflare connection, DNSSEC mutation, URL forwarding, glue records, webhooks, and account administration are not exposed.

## Authentication and credential isolation

Porkbun API authentication uses a public API key and secret API key. Current API documentation supports `X-API-Key` / `X-Secret-API-Key` headers or JSON-body credentials. The official MCP server accepts them from these environment variables:

```text
PORKBUN_API_KEY=pk1_...
PORKBUN_SECRET_API_KEY=sk1_...
```

The connector passes those values only to the official MCP subprocess environment. They never appear in connector tool schemas or results.

Porkbun supports least-privilege controls at the key/account layer. Restrict keys to the specific domains and source IP CIDRs required by the deployment. For testing, a `pk1_sb_` sandbox key exercises the API in an isolated environment with fake credit and no real registry/DNS actions.

## Environment variables

```text
PORKBUN_API_KEY=
PORKBUN_SECRET_API_KEY=
PORKBUN_APPROVAL_SECRET=
PORKBUN_REQUIRE_WRITE_APPROVAL=true
PORKBUN_ENABLE_DESTRUCTIVE=false
PORKBUN_UPSTREAM_COMMAND=npx
PORKBUN_UPSTREAM_PACKAGE=@porkbunllc/mcp-server
PORKBUN_TIMEOUT_MS=20000
PORKBUN_MAX_READ_RETRIES=2
```

`PORKBUN_UPSTREAM_PACKAGE` is validated and cannot be changed to an unofficial package. `PORKBUN_APPROVAL_SECRET` must come from a trusted approval service/operator and should not be available to the LLM.

## Permission and approval model

- **READ**: may execute automatically.
- **WRITE**: requires connector approval by default; controlled by `PORKBUN_REQUIRE_WRITE_APPROVAL`.
- **HIGH_RISK**: always requires explicit approval. Nameserver replacement is HIGH_RISK because it changes authoritative DNS for the entire domain.
- **DESTRUCTIVE**: always requires explicit approval and `PORKBUN_ENABLE_DESTRUCTIVE=true`. DNS deletion is disabled by default.

Approvals are HMAC-SHA256 values bound to both the exact tool name and canonical payload:

```text
HMAC_SHA256(
  PORKBUN_APPROVAL_SECRET,
  "<tool-name>\n<canonical-json-without-approval_token>"
)
```

Any change to the domain, record ID, record content, TTL, priority, or nameserver list invalidates the approval. The approval token is removed before the call is forwarded upstream.

The intended execution boundary is:

```text
Read -> Recommend -> Prepare exact payload -> Human approve -> Execute
```

An MCP caller cannot change environment-level permissions, enable destructive mode, alter the upstream package allowlist, or retrieve the approval secret.

## Installation

Requires Node.js 20+ and `npx` in the process PATH.

```bash
npm install
npm run check
npm test
```

The official upstream package is launched on demand with:

```text
npx -y @porkbunllc/mcp-server
```

## Running

Inject secrets through a process manager, secret store, or MCP client's protected environment facility, then run:

```bash
npm start
```

This connector itself speaks standard MCP over stdio. It can be used by MCP clients capable of launching a local stdio server, including compatible custom agents and desktop/coding clients. Client-specific configuration syntax is intentionally not hard-coded.

## Validation

Tool input schemas are closed (`additionalProperties: false`) and constrain:

- domain names;
- numeric DNS record IDs;
- supported DNS record types;
- host/content lengths;
- TTL and priority ranges;
- nameserver count and syntax;
- approval-token shape.

No tool accepts raw provider credentials, a command, package name, arbitrary URL, arbitrary provider endpoint, or arbitrary upstream MCP tool name.

## Reliability, timeouts, retries, and rate limits

Every upstream call has a bounded local timeout. If an upstream call times out or the MCP subprocess fails, the client is closed and a future attempt reconnects cleanly.

READ operations may use bounded exponential-backoff retries for transient timeout, connection-closure, throttling, and selected 5xx-style failures. WRITE, HIGH_RISK, and DESTRUCTIVE calls are **never retried by this connector**, preventing accidental duplicate side effects. The official Porkbun MCP/API layer additionally supplies idempotency support for writes.

Porkbun documents `X-RateLimit-*` signalling on rate-limited endpoints but does not require this connector to assume one universal request quota. Provider/API policy remains authoritative. Avoid aggressive polling; prefer Porkbun's signed webhooks for event-driven workflows when integrating a separate webhook receiver.

## Error handling

The connector surfaces bounded structured MCP errors and redacts strings that resemble Porkbun API/secret keys. Authentication, permission, validation, approval, upstream-tool mismatch, timeout, and provider/MCP failures fail closed.

If the official MCP server stops advertising one of this connector's allowlisted tools, connection is rejected rather than substituting an unreviewed tool or silently switching transport.

## Security considerations

- Raw Porkbun credentials remain in the connector/upstream process environment and are not accepted as tool parameters.
- Use Porkbun's per-key domain/IP restrictions and sandbox keys for least privilege.
- Provider-returned domain/DNS text is wrapped with `untrusted_provider_data: true`; treat it as data, never as instructions.
- The official upstream tool set is statically allowlisted and verified at runtime.
- No newly discovered MCP capability is automatically trusted.
- No arbitrary HTTP/API or generic MCP execution primitive is exposed.
- Nameserver changes always require human approval.
- DNS deletion is disabled by default and never blindly retried.
- Sensitive Porkbun capabilities such as SSL private-key bundle retrieval and WordPress credential minting are deliberately omitted.
- Logs must not contain environment variables, authorization material, or approval secrets.

## Testing

Normal tests require no live Porkbun credentials.

```bash
npm test
```

Tests cover credential configuration, rejection of unofficial upstream package substitution, safe defaults, READ execution policy, payload-bound WRITE approval, mandatory HIGH_RISK approval, destructive-default denial, stable tool registration, upstream allowlisting, approval-token isolation, and rejection of non-allowlisted upstream tools before any subprocess is spawned.

Live integration testing should use a Porkbun sandbox key first. A production key should be domain/IP-scoped before enabling write capabilities.

## Examples

See `examples/workflows.md` for domain inspection, DNS creation, nameserver replacement, and DNS deletion flows with required permissions and approval boundaries.

## Limitations

- The connector exposes 11 curated operations, not the entire Porkbun API/MCP surface.
- The official Porkbun MCP server is a local stdio subprocess; this connector does not use a remote hosted MCP endpoint.
- OAuth is not used; Porkbun's documented API-key pair is the credential model for this connector.
- The connector does not ingest signed webhooks. Event receivers should be separate HTTPS services that validate Porkbun webhook signatures before passing trusted event metadata into an agent workflow.
- No billable domain registration/renewal/transfer tools are exposed.
- No SSL bundle tool is exposed because the official response can contain private key material.
- No account spend-setting, API-key-management, contact mutation, hosting, WordPress credential, or Cloudflare authorization tools are exposed.
- Provider-side plan, TLD, account, API-access, and domain restrictions still apply even when local validation succeeds.
