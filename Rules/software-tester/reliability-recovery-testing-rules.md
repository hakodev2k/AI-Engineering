# Reliability and Recovery Testing Rules

## Purpose
Validate that systems fail predictably and recover without unacceptable loss.
## Scope
Retries, failover, restart, degradation, recovery, backup/restore, and dependency failure.
## MUST
- Test critical failure modes and recovery expectations derived from architecture and operational requirements.
- Verify data consistency and side effects after interrupted operations.
- Capture recovery time and recovery completeness when they are contractual or operational requirements.
## MUST NOT
- Assume successful restart proves recovery correctness.
- Trigger destructive failure experiments in production without explicit approval.
## SHOULD
- Test partial dependency failures and repeated operations for duplicate or lost work.
## Exceptions
Unsafe failure modes may use controlled simulations with documented limitations.
## Verification
Review fault scenarios, recovery evidence, data checks, timing, logs, and unresolved residual risks.