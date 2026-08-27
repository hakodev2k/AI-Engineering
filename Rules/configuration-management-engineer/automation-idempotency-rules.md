# Automation and Idempotency

## Purpose
Ensure configuration automation converges safely and behaves predictably under retries and repeated execution.

## Scope
Provisioners, configuration agents, reconciliation loops, deployment scripts, and synchronization jobs.

## MUST
- Reapplying the same desired configuration MUST converge without unintended cumulative side effects.
- Automation MUST detect and surface partial failures.
- Retries MUST be safe for the operation being retried or guarded by explicit deduplication or state checks.
- Ordering dependencies MUST be explicit when resources cannot be reconciled independently.
- Automation MUST validate prerequisites before performing destructive or high-impact actions.

## MUST NOT
- A retry MUST NOT duplicate irreversible actions merely because the prior result is unknown.
- Automation MUST NOT hide non-convergence by repeatedly reporting success while making changes every run.
- Scripts MUST NOT depend on undocumented interactive state for production execution.

## SHOULD
- Prefer declarative convergence over imperative mutation chains.
- Emit machine-readable change summaries and failure reasons.

## Exceptions
Intrinsically non-idempotent operations require explicit guards, durable execution records, and recovery procedures.

## Verification
Run automation repeatedly against already-converged state and confirm no unintended changes. Inject failures between steps, retry, and inspect resulting state, logs, and exit status for deterministic recovery.