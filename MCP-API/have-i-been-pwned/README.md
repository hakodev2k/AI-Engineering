# Have I Been Pwned MCP Connector

Reusable MCP server for breach-intelligence workflows backed by the official Have I Been Pwned (HIBP) MCP server and official HIBP REST APIs.

## Upstream transports

- Official MCP: `https://haveibeenpwned.com/mcp`
- REST API v3: `https://haveibeenpwned.com/api/v3`
- Pwned Passwords range API: `https://api.pwnedpasswords.com/range/{prefix}`

Official references:
- https://haveibeenpwned.com/Docs/MCP
- https://haveibeenpwned.com/API/V3
- https://haveibeenpwned.com/Subscription

HIBP publishes an official remote MCP server. Public breach metadata, data classes, and Pwned Passwords range lookups are available without sign-in. The official MCP uses OAuth for protected agent access with the `hibp.mcp` scope. This connector deliberately uses that official MCP for public operations, then falls back to the official REST APIs if the remote MCP cannot be reached. Protected email/domain/subscription operations use HIBP's official REST API with an API key so credentials remain isolated inside the connector rather than being exposed to an LLM.

## Implemented tools

| Tool | Transport | Risk | Auth | Purpose |
|---|---|---|---|---|
| `hibp.breach.list` | MCP -> REST fallback | READ | none | List/filter breach metadata |
| `hibp.breach.get` | MCP -> REST fallback | READ | none | Get one breach by stable name |
| `hibp.breach.latest` | MCP -> REST fallback | READ | none | Get the latest added breach |
| `hibp.data_class.list` | MCP -> REST fallback | READ | none | List exposed-data classes |
| `hibp.password.range` | MCP -> REST fallback | READ | none | Query a five-character SHA-1/NTLM prefix using k-anonymity |
| `hibp.account.breaches` | REST | READ | API key | Find breaches for an email address |
| `hibp.account.pastes` | REST | READ | API key | Find paste records for an email address |
| `hibp.domain.breaches` | REST | READ | API key + eligible plan + verified domain | Find breached aliases for a domain |
| `hibp.domain.subscriptions` | REST | READ | API key | List subscribed/verified domains |
| `hibp.subscription.status` | REST | READ | API key | Inspect plan capabilities and RPM |

No generic arbitrary-request tool is exposed. Domain-verification mutations, outbound verification email, billing changes, and any destructive operation are intentionally excluded.

## Architecture

```text
MCP client
  -> local stdio MCP server
     -> strict tool schemas + permission allowlist
        -> official HIBP MCP for public read tools
           -> official REST fallback
        -> official REST for protected read tools
           -> API key stays inside connector
```

Third-party data is returned with `untrustedData: true`. Retrieved breach descriptions or other provider content must be treated as data, not as instructions capable of changing permissions or connector behavior.

## Authentication

### Official MCP

HIBP's remote MCP advertises OAuth discovery metadata. Protected remote MCP tools use the `hibp.mcp` scope. This package does not proxy OAuth bearer tokens to the LLM and does not require them for its public MCP-first operations.

### REST API

Protected REST operations require an HIBP API key supplied through `HIBP_API_KEY`. Every API request includes an identifying `User-Agent`; HIBP rejects requests without one. Never place the API key in prompts, examples, source code, logs, or tool parameters.

Environment variables:

```text
HIBP_API_KEY=
HIBP_USER_AGENT=daily-mcp-have-i-been-pwned
HIBP_TIMEOUT_MS=10000
HIBP_MAX_RETRIES=2
HIBP_USE_OFFICIAL_MCP=true
HIBP_ALLOWED_PERMISSIONS=
```

`HIBP_API_KEY` is optional for public tools and mandatory for protected REST tools. `HIBP_ALLOWED_PERMISSIONS` is an optional comma-separated allowlist such as `breach:read,password:range:read`.

## Permissions and approval

All exposed tools are `READ`. None publishes data, sends messages, changes HIBP account state, alters domain verification, changes permissions, or deletes resources. Therefore human approval is not required by default.

The connector still enforces per-tool permission names:

- `breach:read`
- `password:range:read`
- `account:breach:read`
- `account:paste:read`
- `domain:breach:read`
- `domain:subscription:read`
- `subscription:read`

If `HIBP_ALLOWED_PERMISSIONS` is configured, calls outside that allowlist fail before provider access. Retrieved content can never elevate these permissions.

## Installation

Requirements: Node.js 20+.

```bash
npm install
npm run build
```

## Run

```bash
cp .env.example .env
# load environment variables using your preferred secret/runtime mechanism
npm start
```

The server uses MCP stdio transport and can be launched by MCP clients that support local stdio servers, including compatible agent runtimes. Compatibility depends on the client's standard MCP stdio support; this package does not claim proprietary integrations beyond that protocol.

## Example MCP client entry

```json
{
  "mcpServers": {
    "have-i-been-pwned": {
      "command": "node",
      "args": ["/absolute/path/MCP-API/have-i-been-pwned/dist/src/server.js"],
      "env": {
        "HIBP_API_KEY": "${HIBP_API_KEY}",
        "HIBP_USER_AGENT": "my-security-agent"
      }
    }
  }
}
```

## Reliability

The REST transport implements:

- request timeout and cancellation with `AbortController`
- bounded retries for network failures, HTTP 429, and HTTP 5xx
- exponential backoff when `Retry-After` is absent
- `Retry-After` preservation in `HibpError`
- no retries for validation, authentication, permission, or other deterministic 4xx failures
- explicit 404-to-empty-result mapping for breach/paste/domain searches where absence is a valid result
- lazy official MCP connection plus REST fallback for public MCP-backed tools

HIBP plan-specific rate limits are returned by the subscription status endpoint. The connector respects HTTP 429 and `Retry-After`; callers should avoid operating exactly at the plan ceiling. HIBP documents no rate limit for Pwned Passwords, while other APIs may be plan-specific or independently throttled.

## Security

- Secrets exist only in connector environment/configuration.
- API keys are never accepted as MCP tool arguments.
- All upstream URLs are fixed constants; callers cannot supply arbitrary hosts, preventing SSRF-style proxy abuse.
- Tool schemas validate email/domain/breach-name/hash-prefix inputs.
- Password lookup accepts only a five-character hash prefix, never plaintext passwords.
- Pwned Passwords padding uses the official `Add-Padding` request header.
- Email/domain lookups can expose sensitive security information; restrict connector access appropriately.
- Provider content is marked untrusted and must not be interpreted as agent instructions.
- Domain verification write tools and the official MCP verification-email tool are deliberately not registered because they change state or send irreversible external communications.

## Attribution

HIBP's breach and paste APIs are licensed under Creative Commons Attribution 4.0 and require visible attribution when the data is represented. Outputs include `source: "Have I Been Pwned"`; applications must preserve suitable attribution in their user-facing experience. Pwned Passwords has separate terms described by HIBP.

## Error behavior

- `400`: invalid provider request
- `401`: missing/invalid HIBP API key
- `403`: missing User-Agent, insufficient plan/access, or unverified domain
- `404`: mapped to an empty result where absence is expected; otherwise surfaced
- `429`: bounded retry respecting `Retry-After`, then surfaced
- `5xx`: bounded retry, then surfaced
- timeout/network failure: mapped to `HibpError`

## Testing

Normal tests use faked `fetch` and require no live credentials.

```bash
npm test
```

Coverage includes configuration, tool metadata, permission denial, missing credentials, authenticated headers, 404 handling, rate-limit retry, timeout handling, MCP-disabled REST fallback, and Pwned Passwords parsing/padding.

## Limitations

- Protected operations use REST/API-key authentication rather than proxying the official MCP OAuth flow.
- Plan-restricted APIs require an eligible HIBP subscription.
- Domain search requires prior domain verification in HIBP.
- The connector does not expose stealer-log or domain-verification mutation tools in this version, keeping the package focused on high-value read-only workflows.
- The official MCP may evolve independently; if a public MCP tool changes incompatibly, the documented REST fallback remains the stable path for implemented public capabilities.
