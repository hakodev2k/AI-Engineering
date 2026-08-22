# MCP OAuth Consent-State Binding Guard

## Topic
Bind explicit user consent, OAuth state, downstream client identity, redirect URI, requested resource/scope, PKCE, browser session, and callback lifecycle into one verifiable MCP OAuth transaction.

## Category
Security

## Problem
A proxy can validate a syntactically correct OAuth callback yet still act as a confused deputy if it cannot prove that the callback belongs to the browser/session that explicitly consented to the exact downstream MCP client. Authorization URLs and loopback callback lifecycle add separate client-side attack and reliability surfaces.

## Evidence
`evidence/research.md` documents CVE-2026-27124 / GHSA-rww4-4w9c-7733, the MCP 2026-07-28 security requirements, and a current loopback callback failure report. Observed evidence, interpretation, and the proposed control are separated there.

## Existing approach
OAuth `state`, PKCE, redirect registration, provider consent, dynamic client registration, CSRF middleware, and browser-launch helpers.

## Existing limitations
A plain `state` check does not prove current downstream-client consent or browser/session binding. Providers may skip repeat consent. Unsafe authorization URL handling can create XSS/shell injection. Loopback redirects can be registered without a live listener.

## Proposed improvement
Use a short-lived, single-use transaction contract created only after explicit consent and bound to client ID, exact redirect URI, resource/scope, PKCE challenge, consent-session identity, and timestamps. Validate authorization URL scheme before launch and require loopback-listener readiness where applicable.

## Architecture
The package combines research, enforceable rules, a reusable review skill, an independent verifier, a bounded workflow, a blocking hook, deterministic policy, an executable reference guard, and regression tests.

## Package tree
```text
mcp-oauth-consent-state-binding-guard/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-oauth-transition.md
├── rules/
│   └── oauth-transaction-integrity.md
├── scripts/
│   └── oauth_transaction_guard.py
├── skills/
│   └── oauth-flow-review.md
├── subagents/
│   └── security-verifier.md
├── tests/
│   └── test_oauth_transaction_guard.py
└── workflows/
    └── secure-oauth-transaction.md
```

## Installation
Requires Python 3.10+ and only the standard library. Integrate the transaction fields into the host's durable/session state; the script is a deterministic reference gate, not a replacement OAuth server.

## Configuration
Review `config/policy.json`. Keep production authorization schemes HTTPS-only, short transaction TTL, S256 PKCE, exact redirect matching, single-use state, resource binding, and loopback-listener attestation enabled unless the applicable standard explicitly requires another secure configuration.

## Usage
Run authorization-phase validation before browser launch:
```bash
python scripts/oauth_transaction_guard.py transaction.json --policy config/policy.json --phase authorize
```
Run callback validation before any token exchange or downstream code issuance:
```bash
python scripts/oauth_transaction_guard.py transaction.json --policy config/policy.json --phase callback
```
Exit codes: `0` allow, `2` invalid input/config, `5` deny.

Run regression fixtures:
```bash
python -m unittest tests/test_oauth_transaction_guard.py
```

## Workflow
Follow `workflows/secure-oauth-transaction.md`: Observe → Measure baseline → Diagnose → Form hypothesis → Implement → Measure again → bounded retry if needed → independent verification.

## Metrics
Transaction-binding coverage, replay rejection, wrong-client/session/redirect/resource/PKCE rejection, dangerous-scheme rejection, loopback-readiness coverage, legitimate-flow success, and secret leakage findings.

## Verification
A legitimate fixture must pass. Replay, wrong client, wrong browser/session, wrong redirect, dangerous authorization scheme, missing listener, expired state, and resource/PKCE mismatches must fail closed. High-risk changes require `subagents/security-verifier.md` rather than implementer-only verification.

## Safety
Never log raw authorization codes, tokens, cookies, state values, or PKCE verifiers. Never bypass consent/state/PKCE/redirect validation for compatibility. Unknown transaction state denies by default.

## Failure handling
Detection: deterministic gate/test or host integration failure. Evidence: sanitized fixture and transition metadata. Retry policy: maximum 2 changed remediation attempts. Fallback: disable or constrain the affected OAuth integration. Escalation: security owner. Stop immediately on real credential exposure or after retry exhaustion.

## Definition of Done
- **Implemented:** transaction binding and pre-transition validation are integrated at both authorization and callback boundaries.
- **Measured:** legitimate and adversarial baseline/post-change fixtures are recorded.
- **Verified:** all critical attack fixtures are blocked for expected reasons, legitimate flow succeeds, no secrets are exposed, and an independent verifier approves the result.

## Customization
Extend transaction fields only with deterministic, serializable security facts. Provider-specific exceptions should be narrowly scoped and covered by dedicated fixtures rather than broad global bypasses.
