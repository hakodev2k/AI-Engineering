# MCP OAuth Metadata SSRF Guard

## Topic
Protect MCP OAuth discovery and authorization flows from metadata-driven SSRF, unsafe redirects and unsafe browser navigation.

## Category
Security.

## Problem
An MCP client may trust URLs obtained from a remote server's `WWW-Authenticate` header, protected-resource metadata, authorization-server metadata or redirect responses. If those URLs are fetched or opened without independent validation, an attacker or compromised server can steer the client toward private networks, loopback services, link-local/cloud metadata endpoints, or disallowed browser schemes.

The failure is subtle because validating the initial MCP server URL is not sufficient: OAuth discovery creates a chain of newly supplied endpoints, redirects can change destination, DNS can resolve a public-looking hostname to a non-global address, and browser launchers introduce a separate scheme/navigation boundary.

## Evidence
Current public evidence is documented in `evidence/research.md`. The strongest signals are:
- MCP 2026-07-28 security best practices explicitly document SSRF risk in OAuth metadata discovery and recommend HTTPS plus private/reserved address blocking.
- `modelcontextprotocol/servers#4143` reports MCP URL-fetching exposure to cloud metadata/IAM credential theft.
- `openai/codex#37077` reports MCP OAuth opening a metadata-supplied authorization endpoint without a scheme allowlist.

## Existing approach
Common protections include HTTPS requirements, RFC1918 deny rules, generic redirect settings, cloud metadata hardening, firewalls and standard OAuth metadata validation.

## Existing limitations
These controls are often fragmented. Scheme-only checks miss DNS-resolved private destinations. One-time hostname validation does not protect subsequent redirects. RFC1918-only rules miss loopback, link-local, IPv6 local and other non-global ranges. Generic browser launching can accept schemes that should never come from remote OAuth metadata. Pre-resolution alone also leaves residual DNS-rebinding risk unless the actual connection peer is constrained or verified.

## Proposed improvement
Use one deterministic URL trust boundary for every metadata-derived endpoint:

**Parse → scheme/credential policy → host normalization → DNS/IP classification → allow/deny → bounded request → validate every redirect → validate nested endpoint before later use → peer/egress verification where supported.**

Browser navigation uses a separate strict scheme policy. Security decisions are deterministic and happen before network or OS-launch side effects.

## Architecture
- `config/policy.json` — secure defaults and bounded network limits.
- `scripts/url_policy.py` — resolution-aware URL decision engine.
- `scripts/safe_fetch.py` — bounded metadata fetch with implicit redirects disabled and per-hop validation.
- `skills/core-skills.md` — audit, URL-validation and redirect/browser procedures.
- `rules/engineering-rules.md` — enforceable MUST / MUST NOT / SHOULD controls.
- `subagents/subagents.md` — research, implementation and independent verification roles.
- `workflows/workflows.md` — audit, safe-fetch and regression-response workflows.
- `hooks/hooks.md` — pre-discovery, redirect, pre-browser, regression and final-verification hooks.
- `tests/test_url_policy.py` — adversarial deterministic policy tests using synthetic DNS.
- `evidence/research.md` — observed evidence, current approaches, limitations and sources.
- `verification/verification.md` — Implemented / Measured / Verified status and residual risks.
- `guide-intergration.md` — framework-neutral and .NET integration guidance.

## Package structure
```text
mcp-oauth-metadata-ssrf-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── skills/
│   └── core-skills.md
├── rules/
│   └── engineering-rules.md
├── subagents/
│   └── subagents.md
├── workflows/
│   └── workflows.md
├── hooks/
│   └── hooks.md
├── scripts/
│   ├── url_policy.py
│   └── safe_fetch.py
├── tests/
│   └── test_url_policy.py
└── verification/
    └── verification.md
```

## Installation
Requires Python 3.10+ for the reference scripts; no third-party dependency is required.

From the package root:

```bash
python scripts/url_policy.py --policy config/policy.json --kind fetch --url https://example.com/.well-known/oauth-protected-resource
python -m unittest discover -s tests -p 'test_*.py' -v
```

For production integration, port the invariants into the host application's HTTP/OAuth abstraction rather than shelling out on every request.

## Configuration
`config/policy.json` defaults to HTTPS-only production behavior, fail-closed DNS handling, global-address requirement, bounded redirects/timeouts/response size, embedded-credential rejection and separate browser schemes.

`allow_hosts` is intentionally empty. Adding an allowlist exception for a non-global destination should be development-only or explicitly security-reviewed. An allowlist is not a substitute for TLS validation, authorization, least privilege or egress controls.

## Usage
### Validate a metadata endpoint
```bash
python scripts/url_policy.py \
  --policy config/policy.json \
  --kind fetch \
  --url https://example.com/.well-known/oauth-authorization-server
```

Exit `0` means `ALLOW`; deny/error exits non-zero and prints a reason code.

### Validate before browser launch
```bash
python scripts/url_policy.py \
  --policy config/policy.json \
  --kind browser \
  --url https://idp.example.com/oauth/authorize
```

### Fetch metadata with redirect revalidation
```bash
python scripts/safe_fetch.py \
  --policy config/policy.json \
  --url https://example.com/.well-known/oauth-protected-resource \
  --output /tmp/mcp-resource-metadata.json
```

The fetch wrapper is a reference implementation. A production client should additionally bind or verify connection peer addresses when its transport permits this.

## Workflow
The primary workflow is:
1. inventory metadata-derived URL sinks;
2. establish current validation baseline;
3. centralize policy;
4. disable implicit redirects;
5. validate every redirect and nested endpoint;
6. separately guard browser navigation;
7. run adversarial fixtures;
8. verify positive OAuth interoperability;
9. independently review coverage and residual risk.

Every remediation loop is bounded to two implementation attempts before escalation. Policy denials are never retried as network operations.

## Metrics
Recommended production/security metrics:
- `guarded_url_sinks / discovered_url_sinks`;
- URL decisions by reason code;
- blocked private/link-local/loopback destinations;
- blocked browser schemes;
- redirect hop count and redirect denies;
- metadata discovery latency;
- OAuth success/failure rate after enforcement;
- active policy exception count;
- adversarial fixture pass rate.

A security improvement is not considered verified merely because OAuth still works; deny fixtures must prove the attack path is blocked.

## Verification
See `verification/verification.md`.

During package generation, a deterministic equivalent of the core URL-policy fixture set produced the expected result for 12/12 cases. Static verification confirms secure-by-default control flow in the reference scripts. Host integrations must still run their own HTTP/browser integration tests and address the documented DNS peer-binding residual risk.

## Safety
- No test requires contacting real cloud metadata services or private hosts.
- Synthetic DNS is supported in the policy script for deterministic tests.
- No secrets are stored in config or examples.
- Logs should contain decision metadata, not tokens, authorization codes or sensitive query strings.
- Security policy must not be relaxed automatically to recover interoperability.
- Production exceptions require explicit human/security approval.

## Failure handling
**Detection:** deny reason, DNS failure, redirect limit, oversized response, integration regression or positive OAuth compatibility failure.

**Evidence:** sanitized URL origin, operation kind, reason code, policy version, fixture/test output.

**Retry policy:** zero retries for policy failures; at most one for transient DNS/network failure after policy approval.

**Maximum remediation retries:** two implementation/test cycles.

**Fallback:** preserve strict controls, capture sanitized incompatibility evidence, use a reviewed narrow exception only when necessary.

**Escalation:** security owner for persistent exception, DNS-rebinding residual risk, unknown metadata sink or unexplained deny spike.

**Stop condition:** do not claim completion while an identified metadata URL sink bypasses the guard or a required adversarial fixture fails.

## Definition of Done
- Real current evidence documented.
- Existing approaches and limitations documented.
- Every metadata-derived URL sink identified in the consuming client.
- Centralized URL policy installed.
- Redirects cannot bypass policy.
- Browser authorization endpoint validated separately.
- Timeouts, response size and redirect count bounded.
- Private/loopback/link-local/mixed-address fixtures blocked.
- Positive public HTTPS fixtures still work.
- No unsafe production exception remains unreviewed.
- Residual DNS-rebinding risk mitigated or explicitly accepted.
- Independent verification complete.

## Customization
Tune policy per environment without changing the invariants. Enterprise deployments can integrate the same decision model into an egress proxy, service mesh or firewall. .NET clients can enforce it through a dedicated OAuth discovery service, `DelegatingHandler`, `SocketsHttpHandler` and validated browser-launch wrapper. Other languages should preserve the same parse → resolve → classify → connect → redirect-revalidate sequence and maintain separate fetch/browser policies.
