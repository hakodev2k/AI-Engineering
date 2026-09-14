# VirusTotal MCP Connector

Reusable security-intelligence connector that wraps the VirusTotal/VTAI MCP service behind stable provider-scoped tools, credential isolation, a fixed upstream allowlist and explicit approval for sample submission.

## Upstream and transport

The connector uses MCP Streamable HTTP at `https://ai.virustotal.com/mcp`. Research for this implementation used the VirusTotal MCP registry/repository documentation for the current VTAI service. The upstream exposes report queries for file hashes, URLs, domains and IPs; registered analysis retrieval; submission receipt recovery; and authorized file submission. The local upstream implementation additionally has a local-path submission tool, but this reusable remote wrapper intentionally does not expose it because a remote connector cannot safely assume access to a caller's filesystem.

No REST fallback is used: the selected capabilities are available through the trusted MCP service. The wrapper never performs arbitrary provider requests or dynamically exposes newly discovered upstream tools.

Official/trusted sources:

- VirusTotal MCP Registry identity: `io.github.VirusTotal/virustotal-mcp`
- MCP endpoint: `https://ai.virustotal.com/mcp`
- VirusTotal MCP source/docs: `https://github.com/king-tero/vt-mcp`
- VirusTotal service: `https://www.virustotal.com/`

## Tools

| Tool | Upstream | Risk | Approval |
|---|---|---:|---|
| `virustotal.file.report.get` | `get_file_report` | READ | No |
| `virustotal.url.report.get` | `get_url_report` | READ | No |
| `virustotal.domain.report.get` | `get_domain_report` | READ | No |
| `virustotal.ip.report.get` | `get_ip_report` | READ | No |
| `virustotal.analysis.get` | `get_analysis` | READ | No |
| `virustotal.submission.get` | `get_submission` | READ | No |
| `virustotal.file.submit` | `submit_file` | HIGH_RISK | Required |

Report results are evidence only. Unknown indicators, zero detections, or missing coverage must not be interpreted as proof of safety.

## Authentication

VTAI uses a revocable static VTAI token rather than OAuth. Set `VTAI_TOKEN` in the connector process environment. The wrapper sends it as `Authorization: Bearer` only to the pinned `https://ai.virustotal.com` origin. Credentials are never MCP tool parameters and therefore are not exposed to the model.

Environment variables:

- `VTAI_TOKEN` — required credential.
- `VTAI_MCP_URL` — optional, defaults to the trusted endpoint and is rejected unless its HTTPS origin is `ai.virustotal.com`.
- `VIRUSTOTAL_TIMEOUT_MS` — 1,000–60,000 ms, default 20,000.
- `VIRUSTOTAL_SUBMIT_SHA256_ALLOWLIST` — optional comma-separated SHA-256 allowlist for submissions.
- `VIRUSTOTAL_APPROVAL_SECRET` — at least 32 characters; enables HIGH_RISK submission approval.

VTAI rights and quotas depend on the connected account. This connector does not invent OAuth scopes because the upstream authentication model does not use them.

## Installation and run

Requires Node.js 20+.

```bash
npm install
cp .env.example .env
# Load variables using your secret manager or shell; do not commit .env.
npm run build
npm start
```

The server speaks MCP over stdio, so any MCP client that can launch a stdio server can configure the built `dist/src/server.js` process. Client-specific configuration is intentionally not hard-coded.

## Permission and approval model

All intelligence/recovery operations are `READ`. `virustotal.file.submit` is `HIGH_RISK` because standard VirusTotal submissions are shared with VirusTotal and may be accessible to its security community and partners. It requires an explicit approval receipt: HMAC-SHA256 of `virustotal.file.submit:<sha256>` using `VIRUSTOTAL_APPROVAL_SECRET`. If the secret is absent, submission is disabled. An optional SHA-256 allowlist can further constrain what may be submitted.

The submission handler validates SHA-256 syntax, canonical base64, decoded size (maximum 24,000,000 bytes), and that the digest matches the exact bytes before transport. A timeout on submission reports an unknown write outcome; callers should use `virustotal.submission.get` to recover state rather than blindly retrying.

## Reliability, quotas, and errors

The wrapper imposes a bounded timeout and does not blindly retry provider calls. This is deliberate for submissions, where a retry after an uncertain network outcome could duplicate disclosure. Read callers may retry at their orchestration layer after interpreting the provider error. VTAI owns its service quotas/rate limits; upstream MCP errors, including throttling/auth failures, are propagated as tool failures by the MCP SDK. The connector makes one upstream call per tool invocation and provides a recovery operation for submissions.

## Security

Provider content is wrapped with `untrusted_provider_data: true`; it must be treated as data, never as instructions. The upstream MCP hostname is pinned, its tool names are allowlisted, credentials remain in the transport layer, and no arbitrary URL/API proxy is exposed. URL-report queries disclose the full URL upstream, including private paths/query strings, so use the domain tool when full URL disclosure is unnecessary. Do not submit secrets, personal data, proprietary samples, or files you are not authorized to share.

The connector does not auto-trust upstream tool discovery or unexpected capabilities. Changing the MCP endpoint to another host fails closed.

## Testing

```bash
npm test
npm run build
```

Unit tests require no live credential and cover missing authentication, trusted-origin validation, exact upstream tool registration, approval denial/acceptance, and submission allowlisting. Transport behavior remains isolated behind `VirusTotalUpstream` for mocking in downstream suites.

## Limitations

This connector does not provide a malware sandbox, security verdict, local file reader, arbitrary VirusTotal API proxy, account administration, billing, or permission changes. It does not expose the upstream local-only `submit_local_file` capability. It intentionally does not automatically retry submissions. VTAI free access is authenticated and quota-bound, not anonymous or unlimited.
