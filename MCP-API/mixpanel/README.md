# Mixpanel MCP/API Connector

A reusable, read-only MCP server for bounded Mixpanel product-analytics retrieval. It is designed for headless agents and automation where deterministic least-privilege service-account access is safer than brokering an end user's interactive OAuth session.

## Official transport research

Mixpanel operates an official hosted MCP server and documents MCP access for Claude, ChatGPT, Cursor and other compatible clients. The first-party product page states that MCP can query user behavior, run analyses, build dashboards, manage Lexicon, launch experiments and inspect session replays while preserving Mixpanel roles and project permissions. The US hosted endpoint is `https://mcp.mixpanel.com/mcp`; Mixpanel also announced EU and India support in November 2025.

This package does **not** proxy the hosted MCP server. The reason is security and contract stability: Mixpanel's hosted MCP uses delegated account authorization, exposes a broad and evolving tool surface including write operations, and is governed by organization-level enablement. A reusable unattended connector should not silently inherit that broad interactive grant. Interactive users should connect their MCP client directly to Mixpanel's official server. This connector instead implements a narrow read-only contract over Mixpanel's official query/export APIs using a service account.

Official references reviewed for this connector:
- Mixpanel MCP product page: https://mixpanel.com/ai/mcp
- Mixpanel MCP announcement (official blog, April 2 2026): https://mixpanel.com/blog/mixpanel-mcp-server/
- Mixpanel documentation portal / API references: https://docs.mixpanel.com/
- Mixpanel support API-reference entry point: https://mixpanel.com/contact-us/support/

## Authentication

Set `MIXPANEL_SERVICE_ACCOUNT_USERNAME`, `MIXPANEL_SERVICE_ACCOUNT_SECRET`, and `MIXPANEL_PROJECT_ID`. Query and raw-export calls use HTTP Basic authentication with the service-account username and secret. Credentials are created and permissioned in Mixpanel and remain entirely inside the connector process; they are never accepted as MCP tool arguments or returned to the model.

Use a dedicated service account with access only to the projects this connector must read. Do not reuse a human administrator account. `MIXPANEL_REGION` selects the fixed official host set (`us`, `eu`, or `in`); arbitrary base URLs are intentionally unsupported to prevent SSRF and credential forwarding.

## Exposed tools

| Tool | Purpose | Risk |
|---|---|---|
| `mixpanel.events.export` | Bounded raw event export | READ |
| `mixpanel.profiles.query` | Query user profiles | READ |
| `mixpanel.funnels.list` | List saved funnels | READ |
| `mixpanel.funnel.query` | Query a saved funnel | READ |
| `mixpanel.retention.query` | Retention analysis | READ |
| `mixpanel.cohorts.list` | List cohorts | READ |
| `mixpanel.event.names` | List observed event names | READ |
| `mixpanel.event.properties.top` | Top properties for an event | READ |
| `mixpanel.segmentation.query` | Event segmentation | READ |
| `mixpanel.revenue.query` | Revenue report | READ |

No create/update/delete, feature-flag, experimentation, Lexicon mutation, messaging, or arbitrary-request tool is exposed. Those operations are deliberately omitted rather than emulated because they require wider privileges and stronger human approval semantics.

## Permission and approval model

Every implemented tool is `READ`, so connector-level human approval is not required. Provider-side access is still enforced by the Mixpanel service account and project permissions. If raw events or profiles contain personal data, treat this connector as sensitive-data access and scope the service account accordingly.

`MIXPANEL_ALLOWED_EVENTS` provides an optional connector-side event allowlist. When configured, tools that address an event by name reject any event not explicitly listed.

## Reliability and rate limits

The client uses request timeouts and bounded retries. It retries 429 and transient 5xx responses with exponential backoff and honors `Retry-After` when present. Authentication and validation failures are not retried. Mixpanel query APIs are quota constrained; Mixpanel commonly documents query limits around 60 queries/hour and concurrency controls, while raw export has its own limits. The connector keeps each call bounded, caps page/result sizes, limits raw event export to seven days per call and analytics ranges to 90 days, and never fans out one MCP call into unbounded provider requests.

## Security

- Credentials stay in environment/secret-provider configuration and never enter LLM context.
- Only fixed Mixpanel regional hosts are permitted.
- Inputs use strict JSON schemas and local validation.
- Raw event exports are bounded to reduce accidental bulk exfiltration.
- `MIXPANEL_ALLOWED_EVENTS` can constrain event-level access further.
- Provider responses are tagged `untrustedProviderData: true`; event names, properties, profile fields and report content must not be interpreted as instructions.
- Secret-like fields are removed recursively before response serialization.
- There is no arbitrary URL or arbitrary Mixpanel endpoint tool.

## Installation and run

```bash
cd MCP-API/mixpanel
npm install
npm run build
npm start
```

Node.js 20+ is required. The server uses MCP stdio transport, making it usable by MCP hosts that can launch a local stdio process. Configure credentials through the host's environment/secret settings rather than embedding them in client-visible prompts.

## Testing

```bash
npm test
```

Normal tests use fakes and require no live Mixpanel credentials. They cover tool registration, strict date-window validation, bounded raw export, funnel routing, event allowlisting and rejection of arbitrary tools.

## Error handling

Provider HTTP errors are mapped to connector errors without returning Authorization headers or service-account secrets. 401/403 errors are not retried as permission escalation cannot be repaired by retry. 429 and transient server/network failures are retried within configured bounds.

## Limitations

- This package intentionally exposes only read operations. For Mixpanel MCP write workflows such as dashboard/Lexicon/experiment changes, use the official hosted MCP directly with delegated user authorization and Mixpanel's native governance.
- Query/export API availability can depend on plan, project role and data residency.
- Profile and raw-event responses may contain personal or sensitive data; downstream MCP hosts are responsible for their own data-handling policy.
- API response schemas evolve; the connector returns provider payloads without pretending to normalize fields that Mixpanel itself may change.
