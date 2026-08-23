# Deployment and Rollout Rules
## Purpose
Make production workload changes controlled, observable, reversible, and compatible.
## Scope
Deployments, StatefulSets, DaemonSets, rollout strategies, canaries, and rollback.
## MUST
- Define rollout and rollback behavior before changing critical workloads.
- Preserve compatibility across concurrently running old and new versions when rolling updates can overlap.
- Gate releases on health evidence appropriate to the workload.
- Require human approval for high-risk production deployments when organizational policy or impact warrants it.
## MUST NOT
- Use `latest` or another mutable image reference for controlled production releases.
- Continue a rollout when objective health signals show material regression.
## SHOULD
- Prefer progressive exposure for high-impact changes.
## Exceptions
Emergency remediation may use accelerated rollout with explicit incident ownership and post-change verification.
## Verification
Inspect image digests/tags, rollout strategy, deployment history, health metrics, rollback evidence, and release approvals.