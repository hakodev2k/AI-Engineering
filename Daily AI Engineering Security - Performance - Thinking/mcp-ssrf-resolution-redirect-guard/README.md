# MCP SSRF Resolution and Redirect Guard

**Category:** Security

## Problem
MCP and agent tools frequently accept URLs influenced by users, retrieved content, or model output. Recent 2026 advisories show recurring SSRF vulnerabilities in MCP fetch paths, including complete absence of filtering, unsafe redirect/header behavior, and bypasses of apparently present filters through IPv4-mapped IPv6 normalization.

## Evidence
See [`evidence/research.md`](evidence/research.md). The package is grounded in CVE-2026-19753, CVE-2026-45019, CVE-2026-49857, and public MCP server security reports.

## Existing approach
Teams commonly patch individual packages, block obvious private IP literals, disable fetching, or rely on egress firewalls/proxies.

## Existing limitations
Text-only URL checks do not prove the effective network destination. DNS resolution, parser normalization, mixed address sets, redirects, and credential-bearing headers create additional trust transitions after the initial URL is accepted.

## Proposed improvement
Enforce a destination-verification gate after canonicalization and resolution, repeat it for every redirect/connect attempt, normalize IPv4-mapped IPv6, fail closed on mixed safe/unsafe address sets, and prevent sensitive headers from crossing origins unless explicitly authorized.

## Architecture
The package separates policy, engineering procedure, enforceable rules, independent review, bounded implementation workflow, deterministic preflight automation, and a dependency-free reference validator.

## Package tree
```text
mcp-ssrf-resolution-redirect-guard/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── preflight-ssrf-gate.md
├── rules/
│   └── ssrf-boundary-rules.md
├── scripts/
│   └── url_guard.py
├── skills/
│   └── outbound-destination-assessment.md
├── subagents/
│   └── security-verifier.md
├── tests/
│   └── test_url_guard.py
└── workflows/
    └── harden-and-verify.md
```

## Installation
Requires Python 3.10+ for the reference script/tests. The production application must integrate equivalent checks with its actual DNS resolver and HTTP client's redirect/connect hooks.

## Configuration
Edit `config/policy.json` only to reflect an explicit deployment policy. Do not remove unsafe address classes for convenience. Private-network business requirements should use narrowly scoped allowlists and separate authorization.

## Usage
From the package root:

```bash
python scripts/url_guard.py --policy config/policy.json --url https://example.com --resolved-ip 93.184.216.34
python -m unittest tests/test_url_guard.py
```

For a blocked example:

```bash
python scripts/url_guard.py --policy config/policy.json --url http://metadata.invalid --resolved-ip 169.254.169.254
```

The CLI intentionally does not make network requests or perform DNS itself; production code must supply the exact addresses its HTTP stack may connect to.

## Workflow
Follow [`workflows/harden-and-verify.md`](workflows/harden-and-verify.md): Observe → baseline → diagnose → hypothesis → implement → measure again → bounded retry → independent verification.

## Metrics
- 100% rejection of unsafe-address fixtures.
- 100% redirect-hop revalidation coverage.
- Zero sensitive-header cross-origin leaks.
- Zero unvalidated outbound connections in instrumented paths.
- No regression for approved public fixtures.

## Verification
Run [`hooks/preflight-ssrf-gate.md`](hooks/preflight-ssrf-gate.md), then have the independent role in [`subagents/security-verifier.md`](subagents/security-verifier.md) verify the production-equivalent path. Passing the reference tests alone does not prove an application is protected unless the application invokes equivalent checks at the effective connection boundary.

## Safety
Never test against real cloud metadata endpoints or internal production services. Use deterministic supplied IPs and local isolated fixtures. Do not log authorization headers, cookies, API keys, or fetched secret content.

## Failure handling
Detection: a fixture reaches a denied address class, a redirect bypasses validation, or sensitive headers cross origin. Evidence: preserve non-secret request/decision telemetry. Retry: maximum 2 implementation retries after the initial attempt, each with a changed hypothesis. Fallback: disable or isolate the URL-fetch feature. Escalation: human security owner. Stop condition: inability to observe/control effective destinations or requirement for an overly broad exception.

## Definition of Done
**Implemented:** destination validation is integrated at the effective connection and redirect boundaries. **Measured:** baseline and post-change attack fixtures are recorded. **Verified:** all security tests pass, safe behavior is preserved, no secrets are exposed, redirect/header controls are demonstrated, and an independent verifier approves the result.

## Customization
Add deployment-specific allowed public origins, explicit private-service exceptions, and HTTP-client adapters without weakening the core invariants in [`rules/ssrf-boundary-rules.md`](rules/ssrf-boundary-rules.md).
