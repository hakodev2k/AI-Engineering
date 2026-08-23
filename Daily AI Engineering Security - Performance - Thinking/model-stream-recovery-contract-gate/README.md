# Model Stream Recovery Contract Gate

**Category:** Thinking

## Problem
Long-running agent turns can end after a model-stream stall, transport/API failure, or watchdog timeout, yet the runtime may classify the terminal event as a user interruption or dispatch a failure hook whose recovery decision cannot resume work. That corrupts the evidence used by parents, hooks and unattended workflows to decide what happened and what is safe to do next.

## Evidence
See `evidence/research.md` for current August 2026 reports and existing approaches.

## Proposed improvement
Normalize terminal events before recovery decisions. Record the causal event, actor, classification, hook dispatch, retries and final outcome in an auditable trace. Validate that machine failures never masquerade as human cancellations, recoverable failures traverse the configured recovery path, and retry loops remain bounded.

## Architecture
- `skills/terminal-failure-classification.md`
- `rules/recovery-contract.md`
- `subagents/recovery-verifier.md`
- `workflows/reproduce-recover-verify.md`
- `hooks/terminal-state-canary.md`
- `schemas/terminal-event.schema.json`
- `scripts/recovery_trace_validator.py`
- `tests/test_recovery_trace_validator.py`

## Installation
Python 3.9+; standard library only.

## Usage
```bash
python scripts/recovery_trace_validator.py trace.json --max-retries 2
python -m unittest tests/test_recovery_trace_validator.py
```

Exit codes: `0` contract satisfied, `2` semantic contract violation, `3` malformed input/runtime error.

## Workflow
Observe a real failure; capture the event trace; classify facts without inferring user intent; reproduce with a canary; fix one state-transition or dispatch defect; replay the same canary; independently validate the trace. Maximum remediation attempts: 3.

## Metrics
False-user-cancel count, recoverable-failure hook coverage, retry-budget violations, terminal-event uniqueness, causal-classification coverage and successful recovery rate.

## Verification
**Implemented** means the runtime emits the normalized events or adapter mapping. **Measured** means failing and passing traces are captured from the same canary. **Verified** requires validator pass, bounded retries and independent review that the recorded actor/cause matches observable events.

## Safety
Recovery MUST NOT replay state-changing tool calls merely to continue a model turn. Side effects require separate idempotency/reconciliation controls. Human cancellation always wins over automated recovery.

## Failure handling
Malformed or ambiguous traces fail closed. If causal evidence is unavailable, classify as `unknown_failure`, not `user_cancelled`. Stop after three remediation hypotheses or the configured retry budget.

## Definition of Done
Evidence documented; failure reproduced; normalized trace captured; terminal cause correctly attributed; recovery path observed when configured; retries bounded; tests pass; independent verification complete.
