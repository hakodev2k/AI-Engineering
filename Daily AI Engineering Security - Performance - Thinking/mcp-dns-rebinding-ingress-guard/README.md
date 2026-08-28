# MCP DNS Rebinding Ingress Guard

**Category:** Security

## Problem
Local/private MCP servers using Streamable HTTP or SSE can be driven from an attacker-controlled webpage when DNS rebinding reaches the listener and `Host`/`Origin` or authentication boundaries are missing or misconfigured.

## Evidence
`evidence/research.md` documents July–August 2026 public advisories across Ruby SDK, CircleCI MCP, Python SDK and Go SDK implementations. The repeated cross-implementation pattern shows that patched dependencies alone are insufficient to prove runtime safety.

## Existing approach
Upgrade vulnerable packages, bind to loopback, configure allowed hosts/origins, require authentication for consequential tools, or enforce equivalent controls at a trusted reverse proxy.

## Existing limitations
Security defaults vary across SDKs and versions; proxies may alter headers; loopback alone does not stop browser DNS rebinding; dependency scanning does not verify runtime request rejection.

## Proposed improvement
A fail-closed ingress contract plus deterministic pre-start and regression validation covering bind address, `Host`, `Origin`, wildcard policy and consequential-tool authentication.

## Architecture
```text
mcp-dns-rebinding-ingress-guard/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-start-ingress-check.md
├── rules/
│   └── ingress-security.md
├── scripts/
│   └── ingress_guard.py
├── skills/
│   └── dns-rebinding-threat-analysis.md
├── subagents/
│   └── security-verifier.md
├── tests/
│   └── test_ingress_guard.py
└── workflows/
    ├── regression-verification.md
    └── research-diagnose.md
```

## Installation
Python 3.10+ only; no third-party Python dependencies.

## Configuration
Edit `config/policy.json` for the deployment's exact bind host, allowed hosts/origins and consequential-tool list. Do not add wildcard origins as a convenience fallback.

## Usage
Create a JSON event containing `host`, optional `origin`, `bind_host`, `authenticated`, and `requested_tools`, then run:

`python scripts/ingress_guard.py --event event.json --policy config/policy.json`

Exit 0 means the deterministic policy permits the event; exit 3 means block.

## Workflow
Follow `workflows/research-diagnose.md` for initial investigation and `workflows/regression-verification.md` after upgrades or configuration changes. Integrate `hooks/pre-start-ingress-check.md` before starting/reloading HTTP transport.

## Metrics
- hostile-host rejection coverage
- hostile-origin rejection coverage
- consequential-tool authentication coverage
- vulnerable-version count
- regression-test pass rate

## Verification
Run `python -m unittest tests/test_ingress_guard.py`. A separate reviewer then confirms the runtime framework/proxy applies equivalent controls and that no credential-bearing hostile request is emitted.

## Safety
Fixtures MUST use synthetic data. Never invoke destructive MCP tools or place real secrets in events, tests, logs or examples.

## Failure handling
Detection: guard/test failure or hostile request accepted. Evidence: reason code and sanitized config. Retry: maximum 2 remediation cycles. Fallback: disable HTTP transport or consequential tools and use a safer local transport. Escalation: security owner. Stop condition: secret exposure, privileged hostile invocation or exhausted retries.

## Definition of Done
**Implemented:** policy, deterministic guard and integration hook are present.  
**Measured:** benign and hostile fixtures have recorded results.  
**Verified:** all tests pass, runtime boundaries are independently reviewed, no secret exposure occurred, and no blocking issue remains.

## Customization
Add framework-specific pre-start adapters or deployment tests while preserving fail-closed host/origin/authentication semantics.
