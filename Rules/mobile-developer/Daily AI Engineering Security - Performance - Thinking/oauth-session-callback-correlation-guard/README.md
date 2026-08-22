# OAuth Session Callback Correlation Guard

**Category:** Security

## Problem
Concurrent OAuth flows can be associated with the wrong local task/session if callback handling validates a transaction but commits through mutable active-session state. A fresh Codex App report describes a successful callback from Session A appearing in Session B; earlier multi-instance evidence shows callbacks reaching a different listener/context and failing with `State mismatch`.

## Evidence
See `evidence/research.md` for observed signals, standards context, interpretation, root causes, and source links.

## Existing approach and limitation
OAuth `state`, PKCE, redirect validation, and issuer checks are necessary. They do not by themselves prevent local session mix-up if callback routing later consults the currently active window/session or singleton pending-flow state.

## Proposed improvement
Represent every authorization attempt as an immutable, expiring transaction bound to the initiating session and provider/issuer. Resolve callback exclusively by one-time state; validate issuer/redirect/session existence; atomically consume the transaction before committing connection state; reject ambiguity instead of falling back to active UI state.

## Architecture
- `skills/oauth-correlation-audit.md` — reusable audit/race procedure.
- `rules/oauth-callback-rules.md` — enforceable trust-boundary rules.
- `subagents/oauth-race-investigator.md` — root-cause investigator.
- `subagents/verification-agent.md` — independent security verifier.
- `workflows/concurrent-oauth-verification.md` — bounded diagnose/implement/verify flow.
- `hooks/pre-callback-commit.md` — deterministic blocking hook.
- `scripts/oauth_correlation_guard.py` — state-hash transaction verifier.
- `tests/test_oauth_correlation_guard.py` — concurrency/replay/expiry/issuer tests.
- `evidence/research.md` — current public evidence.

## Installation
Requires Python 3.10+ and no third-party packages. Integrate the transaction store with the actual OAuth client; keep pending transactions in runtime-owned storage protected from model-authored mutation.

## Configuration
Each transaction should include: transaction ID, SHA-256 hash of random `state`, initiating session/security principal, issuer/provider, exact redirect URI, creation/expiry, consumed flag, and PKCE metadata as needed. Store raw PKCE verifiers and credentials only in appropriately protected secret/runtime state, never diagnostic logs.

## Usage
Before session mutation, provide sanitized callback metadata and transaction registry:

`python scripts/oauth_correlation_guard.py verify --callback callback.json --registry pending.json`

Exit 0 returns the exact initiating session. Exit 2 is a security rejection. Exit 1 indicates malformed/unsafe input. Production integration must atomically mark the returned transaction consumed before or together with session commit.

## Workflow
Observe -> baseline concurrent races -> diagnose transaction ownership -> implement immutable registry/atomic consume -> rerun completion-order races -> replay/expiry/issuer/session tests -> independent verification.

## Metrics
Wrong-session commits (target 0), replay accepts (0), unknown/expired accepts (0), concurrent-flow success rate, orphaned pending transactions, state mismatch rate, and callback-to-commit latency.

## Verification
Run `python -m unittest tests/test_oauth_correlation_guard.py`. Then test two real fixture sessions with A-first, B-first, near-simultaneous, replay, expired, unknown-state, wrong-issuer, wrong-redirect, and deleted-session callbacks. Verify every successful mutation target equals the initiating transaction session.

## Safety
No raw authorization codes, access/refresh tokens, cookies, credentials, or PKCE verifier values are required by the deterministic guard. Unknown or ambiguous binding fails closed. The package never recommends disabling state, PKCE, issuer, redirect, or TLS protections.

## Failure handling
Detection: mismatch/replay/expiry rejection or cross-session mutation telemetry. Evidence: audit-safe transaction/session IDs and reason code. Retry: callbacks with consumed state are never retried; one test-environment restart is allowed for infrastructure faults. Fallback: disable concurrent auth flows or use a safer supported auth flow until correlation is fixed. Escalation: human security owner. Stop: any unresolved ambiguity before commit.

## Implemented / Measured / Verified
**Implemented:** transaction-verification logic, rules, hook, race workflow, and tests.
**Measured:** current public reports demonstrate multi-instance state mismatch and a fresh wrong-session success failure mode.
**Verified:** package verification is complete when deterministic/unit tests and application-level race tests show zero cross-session commits and zero replay/expiry acceptance.

## Definition of Done
Evidence documented; transaction model implemented; concurrent starts do not overwrite; callbacks bind by exact state transaction; consume+commit is atomic; issuer/redirect/session checks pass; replay/expiry tests pass; zero credentials logged; independent verification complete; no blocking issue remains.

## Customization
For multi-account clients, additionally bind account/workspace/security-principal identity. For multiple authorization servers, follow RFC 9700 mix-up defenses and keep issuer binding transaction-specific. If concurrent localhost callbacks cannot be isolated safely, reject the second flow explicitly rather than sharing mutable pending state.