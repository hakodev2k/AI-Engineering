# Idempotency and Convergence Rules

## Purpose
Ensure repeated automation runs converge safely instead of accumulating unintended changes.

## Scope
Configuration enforcement, reconciliation loops, provisioning, remediation, and repeated jobs.

## MUST
- Reapplying unchanged intent MUST result in no unintended configuration change.
- Reconciliation MUST compare desired and relevant observed state before mutating devices.
- Non-idempotent operations MUST be explicitly identified, guarded, and tested for retry behavior.
- Convergence loops MUST have bounded retries, termination criteria, and failure reporting.
- Partial success MUST be represented explicitly so reruns do not duplicate completed side effects.

## MUST NOT
- MUST NOT rely on blind command replay where commands have cumulative semantics.
- MUST NOT treat command acceptance as proof that intended state converged.
- MUST NOT run unbounded remediation loops against unstable or conflicting intent.

## SHOULD
- Automation SHOULD expose planned changes separately from applied changes.
- State comparison SHOULD normalize irrelevant formatting and ordering differences.

## Exceptions
Non-idempotent workflows require documented side effects, deduplication strategy, recovery procedure, evidence from repeat-run tests, and approval for production use.

## Verification
Execute repeat-run tests, compare first and subsequent diffs, simulate interrupted runs, verify retry bounds, and confirm final observed state against intended invariants.