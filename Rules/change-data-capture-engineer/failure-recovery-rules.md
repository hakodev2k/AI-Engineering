# Failure Recovery Rules

## Purpose
Recover CDC safely after process, network, broker, source, or sink failures.

## Scope
Restarts, checkpoints, failover, retries, corrupted state, and disaster recovery.

## MUST
- Recovery MUST resume from a known durable checkpoint or an explicitly reconciled position.
- Failover behavior MUST preserve documented ordering and delivery semantics.
- Corrupted checkpoint state MUST trigger controlled recovery, not arbitrary advancement.
- Recovery procedures MUST define stop conditions when source history is no longer available.
- Critical recovery paths MUST be tested before production dependence.

## MUST NOT
- MUST NOT skip unknown ranges to restore green status.
- MUST NOT assume a connector restart repairs downstream divergence.
- MUST NOT destroy old checkpoints until successful recovery is verified.

## SHOULD
- Automate safe restart for understood transient failures.
- Practice source-log-loss and checkpoint-loss scenarios.

## Exceptions
Manual position override requires human approval, bounded range analysis, reconciliation, and audit evidence.

## Verification
Run restart/failover tests, inspect checkpoint history, simulate unavailable log ranges, and validate repaired sink state.