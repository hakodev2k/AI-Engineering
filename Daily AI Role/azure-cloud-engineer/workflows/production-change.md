# Workflow: Production Infrastructure Change

**Trigger:** approved Azure infrastructure modification.
**Inputs:** desired change, impacted resources, IaC diff, owners, window, rollback, validation.
**Stages:** classify blast radius → map dependencies → freeze conflicting mutations → run plan/what-if → peer review → approval gate → pre-change health snapshot → execute smallest reversible step → validate control plane and workload → continue or rollback → post-change monitoring → record evidence.
**Parallel work:** observation, stakeholder communication, and independent validation may run concurrently; resource mutation remains single-owner.
**Stop conditions:** unexpected destructive replacement, unknown dependency, degraded pre-change baseline, approval missing, rollback unavailable for high-risk change.
