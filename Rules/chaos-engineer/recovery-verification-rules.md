# Recovery Verification Rules
## Purpose
Prove the system returns to an acceptable state after faults are removed.
## Scope
Automatic recovery, failover, backlog drain, state reconciliation, and cleanup.
## MUST
- Verify steady state after fault removal.
- Check residual backlog, data consistency, replicas, caches, and degraded modes when relevant.
- Confirm fault tooling fully cleaned up.
## MUST NOT
- Declare recovery because the injection command stopped.
- Leave temporary fault configuration active after the experiment.
## SHOULD
- Measure recovery time against stated objectives.
## Exceptions
Long-running recovery may be handed to operations with explicit ownership and monitoring.
## Verification
Inspect post-run health, cleanup state, data checks, and recovery timing.