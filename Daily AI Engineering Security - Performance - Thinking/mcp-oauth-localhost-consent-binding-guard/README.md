# MCP OAuth Localhost Consent Binding Guard

## Topic
A reusable security package for binding MCP OAuth consent to the exact client, loopback callback, authorization server, protected resource, scopes, PKCE challenge, state, and browser session.

## Category
Security

## Problem
Client ID Metadata Documents can authenticate a web-hosted metadata identity but cannot prove which local process owns a `localhost` callback. Separately, MCP OAuth proxies can become confused deputies when browser consent and callback state are not bound to the same transaction. The result can be authorization-code delivery to an unintended local client or proxy flow.

## Evidence
See `evidence/research.md`. Current signals include the MCP 2026-07-28 authorization security specification, MCP security best practices, SEP-991's localhost-impersonation analysis, and reviewed FastMCP advisory GHSA-rww4-4w9c-7733 / CVE-2026-27124.

## Existing approach
PKCE, state, exact redirect registration, Client ID Metadata Documents, resource indicators, consent UI, and domain trust policies each cover part of the flow.

## Existing limitations
These controls can still be implemented as independent checks. Client metadata does not authenticate the local callback process, and a proxy can mis-bind consent if the exact browser/client/issuer/resource transaction is not persisted and consumed atomically.

## Proposed improvement
Create a short-lived, single-use transaction record before browser redirect. Hash sensitive correlation values, bind every security-relevant field, classify loopback redirects separately, and block the callback before code forwarding or token exchange unless every binding matches.

## Architecture
- `evidence/research.md` — public evidence, gap, root causes, metrics.
- `config/policy.json` — deterministic security policy.
- `skills/authorization-transaction-binding.md` — reusable implementation/review procedure.
- `rules/oauth-binding-rules.md` — enforceable MUST/MUST NOT/SHOULD rules.
- `subagents/oauth-security-verifier.md` — independent verifier role.
- `workflows/secure-authorization-flow.md` — bounded observe/measure/implement/verify workflow.
- `hooks/pre-callback-binding-check.md` — blocking pre-forward/token-exchange hook.
- `scripts/consent_binding_guard.py` — executable create/verify validator.
- `tests/test_consent_binding_guard.py` — synthetic replay/mix-up/substitution regressions.

## Actual package tree
```text
mcp-oauth-localhost-consent-binding-guard/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-callback-binding-check.md
├── rules/
│   └── oauth-binding-rules.md
├── scripts/
│   └── consent_binding_guard.py
├── skills/
│   └── authorization-transaction-binding.md
├── subagents/
│   └── oauth-security-verifier.md
├── tests/
│   └── test_consent_binding_guard.py
└── workflows/
    └── secure-authorization-flow.md
```

## Installation
Requires Python 3.11+ and only the Python standard library. For tests, install `pytest` in the development environment.

## Configuration
Edit `config/policy.json` deliberately. Production relaxations for PKCE, exact redirect matching, issuer/resource binding, single-use transactions, loopback consent, or attestation require security review. Never store real credentials in this package.

## Usage
Create a transaction from synthetic/application input:
```bash
python3 scripts/consent_binding_guard.py create request.json --policy config/policy.json
```
Persist only the returned record. On callback:
```bash
python3 scripts/consent_binding_guard.py verify callback.json --policy config/policy.json --record transaction.json
```
Persist the returned `used=true` state atomically before code forwarding/token exchange.

Run regressions:
```bash
python3 -m pytest -q tests/test_consent_binding_guard.py
```

## Workflow
Follow `workflows/secure-authorization-flow.md`: Observe → Measure baseline → Diagnose → Form hypothesis → Implement → Measure again → Independent verification → Complete. Maximum two remediation cycles before human escalation.

## Metrics
Binding coverage; valid-flow success rate; malicious-fixture block rate; replay acceptance count; loopback-consent coverage; mismatch reasons; secret findings; verifier status.

## Verification
**Implemented** means transaction creation/verification is integrated before code forwarding. **Measured** means baseline and post-change fixtures were executed. **Verified** means the independent verifier confirms valid flow works once, replay/mismatch fixtures fail closed, and logs contain no secrets.

## Safety
The script hashes state, PKCE challenge, browser-session correlation, and metadata before persistence. It does not need authorization codes or tokens. Never put production secrets into test fixtures. Never weaken a failing security check to restore compatibility without explicit human approval.

## Failure handling
Detection: non-zero validator exit or failed regression. Evidence: sanitized mismatch classes and transaction ID. Retry policy: start a new authorization flow; do not replay a failed callback. Maximum remediation cycles: two. Fallback: gate/revert the integration. Escalation: security owner. Stop condition: secret exposure, unauthorized forwarding, unresolved issuer/resource ambiguity, or repeated failed verification.

## Definition of Done
- Public evidence documented.
- Baseline behavior captured.
- Transaction binding implemented.
- Required fields and loopback policy enforced.
- Negative fixtures blocked before code forwarding/token exchange.
- Valid fixture succeeds exactly once.
- Tests pass.
- No secrets exposed.
- Independent verifier marks the package/integration verified.
- Residual risks and any approved exceptions documented.
- No blocking issue remains.

## Customization
Add deployment-specific attestation, durable transaction storage, atomic consume semantics, structured audit sinks, or additional issuer/resource policies without removing the mandatory bindings. Adapt the wrapper to application language/framework while preserving the same decision contract and tests.