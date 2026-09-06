# Admission, Checkpoint, and Recovery Workflow

## Trigger
Use when an asynchronous/background agent run can be acknowledged before its first durable workflow checkpoint.

## Goal
Make accepted work durably observable across the pre-checkpoint crash window without introducing unsafe replay.

## Inputs
Request/run ID, idempotency key, input hash, side-effect classification, admission ledger, workflow checkpoint events, acknowledgement path, and recovery policy.

## Baseline
Measure before changes:
- admission-to-first-checkpoint p50/p95/p99;
- count/rate of acknowledged runs with no durable checkpoint;
- count of runs whose final state is unknown after worker loss;
- duplicate side effects after retries;
- recovery success/failure rates.

## Context
Use `../skills/admission-durability-analysis.md`, `../rules/durable-admission-rules.md`, and `../config/policy.json`.

## Stages
1. **Observe** — trace ingress, acknowledgement, worker start, first checkpoint, side effects, and terminal state.
2. **Measure baseline** — capture latency and crash behavior at the admission/checkpoint boundary.
3. **Diagnose** — determine whether caller acknowledgement precedes durable ownership and resumable state.
4. **Form hypothesis** — define the smallest state-machine/ledger change that makes the gap observable.
5. **Implement improvement** — persist admission before acknowledgement; attach stable IDs; mark first checkpoint explicitly.
6. **Measure again** — rerun normal and crashpoint cases.
7. **Improved?** — if a run can still disappear or state becomes ambiguous, revise the hypothesis; maximum two remediation iterations.
8. **Reconcile** — classify stale `accepted` rows as `lost` after the measured timeout.
9. **Recovery decision** — auto-restart only proven side-effect-free/idempotent lost work; otherwise require human review.
10. **Independent verification** — Recovery Verifier repeats crash/recovery tests and validates state transitions.

## Responsible agent
Implementation agent/platform engineer owns integration. `../subagents/recovery-verifier.md` owns final verification and MUST be independent for production changes.

## Tools
Workflow/checkpoint logs, database queries, controlled crash injection, `python3 ../scripts/admission_ledger.py`, and `python3 ../tests/test_admission_ledger.py`.

## Outputs
Lifecycle contract, durable admission evidence, baseline and post-change metrics, crashpoint results, reconciliation report, recovery classification, and verifier verdict.

## Checkpoints
- C1: acknowledgement boundary identified.
- C2: first resumable checkpoint boundary identified.
- C3: admission persisted before acknowledgement.
- C4: checkpoint transition integrated.
- C5: pre-checkpoint crash produces durable `lost` evidence.
- C6: independent verification passes.

## Metrics
Admission-to-first-checkpoint latency, accepted-without-checkpoint count, lost-run rate, stale-accepted age, reconciliation latency, duplicate-side-effect rate, and recovery success rate.

## Retry policy
At most two remediation iterations. A lost run may be replayed automatically only if side-effect-free or idempotency is independently verified. Otherwise retry count is zero until human approval.

## Stop conditions
Stop asynchronous admission if ledger persistence fails, run identity conflicts, a pre-checkpoint crash can disappear without evidence, lifecycle transitions regress, or recovery could duplicate an irreversible effect.

## Failure path
Detection -> preserve ledger/checkpoint identifiers -> mark/classify state -> disable automatic replay for ambiguous side-effecting work -> remediate -> rerun controlled crash tests -> independent review. Escalate after two failed remediation attempts.

## Verification
Thinking/reliability improvement is verified when the lifecycle is externally observable, bounded recovery decisions replace guesswork, lost work is explicitly classified, unsupported "it probably ran" conclusions are eliminated, and crash/recovery tests reproduce expected states.

## Definition of Done
Evidence documented; baseline captured; limitations identified; admission ledger integrated; tests pass; crashpoint metrics collected; before/after comparison complete; risks documented; unsafe replay requires approval; independent verification complete; no accepted run can silently disappear.
