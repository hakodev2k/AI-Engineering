# MCP URL Elicitation Phishing Binding Guard

**Category:** Security

## Problem
URL-mode elicitation crosses an authenticated MCP session into a browser. A valid URL can still be unsafe when replayed, opened by another principal, redirected to another origin, or accepted without binding completion to the originating request.

## Evidence
See `evidence/research.md`; current MCP docs describe cross-user phishing and 2026-07-28 SDK guidance shifts correlation to server-managed MRTR state.

## Existing approach and limitations
MCP requires destination disclosure, consent, secure browser handling, and user verification; OAuth state/PKCE cover parts. The protocol cannot enforce application correlation, consent is not identity proof, and adapters can lose binding semantics.

## Proposed improvement
Bind principal, server origin, logical request, target origin, nonce, issue time, and expiry. Validate before navigation and completion; consume successful nonces once.

## Architecture
`evidence/research.md`; `rules/url-elicitation-security.md`; `skills/review-url-elicitation.md`; `subagents/url-elicitation-verifier.md`; `workflows/secure-url-elicitation.md`; `hooks/pre-navigation-check.md`; `scripts/elicitation_binding_guard.py`; `tests/test_elicitation_binding_guard.py`.

## Installation
Python 3.10+; no third-party dependencies.

## Configuration
Supply authenticated principal/server/request IDs, URLs, nonce, timestamps, and durable nonce-consumption state. Never hard-code credentials.

## Usage
Issue: `python scripts/elicitation_binding_guard.py issue --record binding.json`

Completion: `python scripts/elicitation_binding_guard.py complete --record completion.json`

## Workflow and metrics
Follow `workflows/secure-url-elicitation.md`. Track blocked principal mismatch, origin drift, replay, expiry, unsafe navigation, consent coverage, and completion-binding coverage.

## Verification
Run `python -m unittest tests/test_elicitation_binding_guard.py`. Valid flow must succeed once; cross-user completion, replay, expiry, HTTP, embedded credentials, and origin drift must fail closed.

## Safety
Never move credentials from browser into MCP context and never bypass principal/replay/expiry checks. Development localhost exceptions must be explicit.

## Failure handling
Retry environmental setup at most twice. Deterministic security failures require code/policy change. If identity cannot be bound, keep URL mode disabled and escalate.

## Definition of Done
**Implemented:** binding gates exist. **Measured:** attack fixtures and legitimate controls recorded. **Verified:** independent verifier confirms mandatory rules, tests pass, no secret exposure/blocker remains.

## Customization
Extend origin policy/audit integration without weakening binding invariants.
