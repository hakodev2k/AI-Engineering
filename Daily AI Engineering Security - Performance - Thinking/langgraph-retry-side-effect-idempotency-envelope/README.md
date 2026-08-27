# LangGraph Retry Side-Effect Idempotency Envelope

**Category:** Thinking

## Problem
Retryable or resumable agent nodes can repeat external side effects such as payments, emails, writes, or mutations. Checkpointing preserves graph state, but it does not automatically make an arbitrary external side effect exactly-once.

## Evidence
See `evidence/research.md` for current LangGraph documentation and July/August 2026 issue signals.

## Existing approach
LangGraph documents retries, durable execution, tasks, checkpointing and idempotent side effects. Developers can use idempotency keys or check existing results.

## Existing limitations
The application still owns the external idempotency boundary. A node retry, process restart, interrupt resume, or duplicate child task can replay a mutation unless a stable operation identity is claimed durably before the side effect.

## Proposed improvement
Use a reusable side-effect envelope: derive a stable idempotency key from business intent, atomically claim it in a durable ledger, execute only after claim acquisition, persist the result, and return the persisted result on replay. Retry loops are bounded and independently verified.

## Architecture
- `config/policy.json` — retry/claim policy
- `scripts/idempotency_guard.py` — SQLite claim/result ledger
- `tests/test_idempotency_guard.py` — restart/replay tests
- `examples/operation.json` — sample operation intent
- `skills/retry-side-effect-analysis.md` — diagnosis procedure
- `rules/idempotent-side-effects.md` — enforceable rules
- `subagents/reliability-verifier.md` — independent review
- `workflows/execute-with-envelope.md` — bounded execution flow
- `hooks/pre-side-effect.md` — blocking claim hook
- `evidence/research.md` — public evidence

## Installation
Python 3.10+; standard library only.

## Configuration
`config/policy.json` defines maximum attempts and stale-claim behavior. Production deployments SHOULD place the SQLite ledger on durable storage or replace it with an equivalent transactional store.

## Usage
Claim an operation before the external side effect:
```bash
python scripts/idempotency_guard.py --db state/idempotency.db claim --operation examples/operation.json
```
If `decision=execute`, perform the side effect once, then complete the claim with a result file:
```bash
python scripts/idempotency_guard.py --db state/idempotency.db complete --operation examples/operation.json --result result.json
```
A replay returns `decision=reuse` after completion and MUST NOT repeat the side effect.

## Workflow
Observe retry boundary → identify side effects → derive stable identity → atomically claim → execute once → persist result → replay safely → independently verify.

## Metrics
Duplicate-effect count, claim conflicts, retries/operation, completed-result reuse rate, stale-claim recoveries, verification coverage, and rework caused by ambiguous operation identity.

## Verification
Run:
```bash
python -m unittest tests/test_idempotency_guard.py
```

## Safety
The ledger stores operation metadata and result references, not secrets. Dangerous or irreversible actions still require whatever human approval and authorization policy the application normally requires; idempotency is not authorization.

## Failure handling
Detection distinguishes `execute`, `wait`, `reuse`, and `blocked`. Maximum attempts are bounded. Unknown or unstable identity blocks execution rather than inventing a new key.

## Definition of Done
**Implemented:** all externally visible side effects use a stable envelope.  
**Measured:** duplicate-effect and retry metrics are captured.  
**Verified:** restart/replay tests prove one effect per operation identity, approvals remain intact, and an independent verifier confirms no silent duplicates.

## Customization
Replace SQLite with another transactional claim store if needed, preserving compare-and-set semantics and stable operation identity.