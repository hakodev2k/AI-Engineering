# A2A Consequential Action Authorization Envelope

**Category:** Security

## Problem
Transport authentication can establish who connected to an A2A endpoint without proving that the identified caller authorized one exact consequential action with exact parameters, receiver, purpose and lifetime. Retries, delegation and shared credentials can further blur which principal authorized a side effect.

## Evidence
Current public signals, official recommendations, existing approaches and limitations are documented in `evidence/research.md`.

## Proposed improvement
Bind authorization to a canonical action envelope containing caller, receiver, task/message digest, semantic action, parameter digest, purpose, issue/expiry time, nonce, authorization ID and one-use limit. Verify the envelope immediately before the side effect, then atomically consume or idempotently reconcile it.

## Architecture
```text
.
├── README.md
├── evidence/research.md
├── hooks/pre-consequential-a2a-action.md
├── rules/consequential-action-authorization.md
├── schemas/action-authorization-envelope.schema.json
├── scripts/verify_authorization_envelope.py
├── skills/action-authorization-analysis.md
├── subagents/security-verifier.md
├── tests/test_verify_authorization_envelope.py
└── workflows/authorize-execute-reconcile.md
```

## Installation
Python 3.10+ only. The verifier uses the standard library.

## Usage
```bash
python scripts/verify_authorization_envelope.py envelope.json request.json \
  --used-authorizations used.json --now 2026-08-24T15:00:00Z
python -m unittest tests/test_verify_authorization_envelope.py
```
Exit codes: `0` verified, `2` authorization-policy violation, `3` malformed evidence/input.

## Inputs
The request must expose `caller_id`, `receiver_id`, `task_id`, `message_sha256`, `action`, `parameters_sha256`, and `purpose`. The authorization envelope additionally binds `authorization_id`, `issued_at`, `expires_at`, `nonce`, and `max_uses`.

## Workflow
Follow `workflows/authorize-execute-reconcile.md`. Transport authentication and protocol authorization happen first; this envelope is the final exact-action authorization boundary, not a replacement for either.

## Metrics
- consequential actions with verified exact-action envelopes / total consequential actions
- authorization replay blocks
- caller/receiver/task/action/parameter mismatch blocks
- ambiguous-outcome blind retry count (target: 0)
- expired authorization blocks
- high-risk actions with exact human approval binding

## Verification
Unit tests cover exact-match success, parameter substitution, wrong receiver, expiration and replay. Integration verification must prove a used authorization cannot cause a second side effect and that an ambiguous network result enters reconciliation rather than blind replay.

## Safety
Do not put secrets or bearer tokens in the envelope. Never convert authentication success into action authorization. Dangerous or irreversible operations require explicit human approval bound to the exact envelope. Do not weaken idempotency or authorization to improve reliability.

## Failure handling
Malformed evidence fails closed. A rejected envelope is never auto-expanded. Ambiguous execution may be reconciled once against downstream state; it must not be blindly replayed. Unresolved ambiguity stops and escalates.

## Definition of Done
**Implemented:** schema, deterministic verifier, rules, workflow, hook, skill, independent reviewer and tests exist.  
**Measured:** representative action traces record match/replay/expiry metrics.  
**Verified:** tests pass; all consequential actions are checked at execution time; one-use consumption/idempotency is enforced; dangerous actions have exact human approval; no secret is exposed.

## Customization
Organizations may add action-specific limits to the envelope, but MUST keep the core caller/receiver/task/message/action/parameter/purpose/expiry/replay bindings intact.