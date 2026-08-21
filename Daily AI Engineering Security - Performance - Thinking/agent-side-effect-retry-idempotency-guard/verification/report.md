# Verification Report

## Scope

This report verifies the reusable package itself. It does not claim production exactly-once delivery or production metric improvement before integration into a real host/runtime.

## Implemented

- Evidence-backed problem analysis with current sources.
- Explicit tool classifications: `read_only`, `idempotent_write`, `non_idempotent_write`.
- Stable logical operation key and canonical argument fingerprint.
- Durable reference state model: `reserved`, `in_progress`, `completed`, `known_failed`, `outcome_unknown`, `cancelled`.
- Conflict rejection for same logical key with changed fingerprint.
- Duplicate completed-call replay decision without re-execution.
- In-progress/ambiguous duplicate blocking.
- Retry budget enforcement.
- Separate handling for verified downstream idempotency.
- Deterministic side-effect probe evaluator.
- Explicit human override field for unresolved ambiguity.
- Skills, enforceable rules, specialized subagents, bounded workflows, hooks, integration guide, schema, policy, examples, and regression tests.

## Measured

No production before/after latency, duplicate-rate, or false-block measurements are claimed in this package because it is not yet integrated into a specific runtime.

The integration defines measurable counters to collect:

- duplicate side-effect executions per 1,000 logical operations;
- keyed-write coverage;
- ambiguous-outcome blocks;
- completed-result replays;
- key/fingerprint conflicts;
- retry attempts per logical operation;
- probe present/absent/unknown rate;
- human escalation rate;
- false-block rate;
- guard decision latency.

## Verified package invariants

The supplied regression suite covers:

1. same logical operation cannot be newly reserved twice;
2. same key with changed arguments is a hard conflict;
3. completed duplicates yield replay behavior;
4. ambiguous non-idempotent writes are blocked;
5. a conclusive `effect_absent` probe allows bounded retry;
6. a conclusive `effect_present` probe reconciles without write retry;
7. read-only ambiguous results can be retried;
8. `idempotent_write` requires verified downstream idempotency before ambiguous retry;
9. known failure can retry within budget;
10. retry budget blocks further dispatch;
11. human override is explicit rather than implicit.

The implementation does not automatically execute external tools, does not require secrets, and uses safe local deterministic state transitions.

## Security boundary review

### Preserved

- The guard never grants tool permissions.
- It never weakens authentication/authorization.
- It does not execute destructive operations itself.
- Unknown outcomes remain visible.
- Retrying a write requires deterministic policy rather than a model-only decision.
- Human approval remains explicit for forced retry.
- Secret-bearing arguments should remain outside ledger metadata; only hashes/references are required.

### Known limits

- The bundled JSON ledger is a single-host reference implementation; production multi-worker deployments require an atomic durable store.
- No local ledger can guarantee mathematical exactly-once behavior if the process crashes between an external commit and durable result-state persistence. The package handles this by preserving `outcome_unknown` and requiring reconciliation.
- Side-effect probes can be limited by eventual consistency or incomplete queryability.
- A downstream idempotency guarantee is only as strong as its retention, scope, conflict behavior, and actual end-to-end propagation.
- MCP SEP-3182 is still a proposal as of the research date; integrations must feature-detect/verify support.

## Failure handling verification

- Reservation/store unavailable for a write → block dispatch.
- Same key/different fingerprint → reject.
- Duplicate `in_progress` → block concurrent execution.
- Lost response after dispatch → `outcome_unknown`.
- Non-idempotent unknown without conclusive probe/approval → block.
- Retry budget exhausted → terminal block.
- Probe inconclusive → preserve unknown and escalate.
- High-risk integration change without independent review → not Definition of Done.

## Definition of Done for a real integration

A production integration is verified only when all of the following are true:

- every state-changing tool has a reviewed classification;
- every write is reserved before dispatch;
- operation-store writes are atomic for the deployment topology;
- stable logical keys survive provider fallback/retry/resume;
- same-key changed-argument conflicts are rejected;
- ambiguous write outcomes do not blind-retry;
- all configured probes are read-only and evidence-backed;
- retry budgets are enforced;
- supplied regression tests pass on the integrated implementation;
- at least one staging lost-response test proves a committed side effect is not duplicated;
- high-risk changes receive independent verification;
- operational metrics are collected and compared against baseline;
- no blocking safety issue remains.

## Verification status

- **Implemented:** package complete.
- **Measured:** package-level deterministic behaviors specified; production metrics intentionally not claimed.
- **Verified:** package structure and invariants are represented by executable guards and regression tests; production verification requires the integration-specific Definition of Done above.