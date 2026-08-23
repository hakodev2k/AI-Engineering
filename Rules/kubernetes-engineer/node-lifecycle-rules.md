# Node Lifecycle Rules
## Purpose
Keep worker nodes patched, replaceable, observable, and safe to drain.
## Scope
Node pools, images, patching, cordon/drain, replacement, labels, and node health.
## MUST
- Treat nodes as replaceable infrastructure and automate their creation where practical.
- Maintain supported operating-system and Kubernetes versions with a defined patch cadence.
- Validate drain behavior before node replacement for critical workloads.
- Monitor node pressure, filesystem, runtime, networking, and readiness conditions.
## MUST NOT
- Store irreplaceable application state only on node-local filesystems unless explicitly designed and backed up.
- Manually mutate individual production nodes as a routine configuration strategy.
## SHOULD
- Replace unhealthy or drifted nodes rather than accumulating bespoke repairs.
## Exceptions
Specialized nodes may require controlled manual procedures with documented state and recovery.
## Verification
Inspect node-pool definitions, versions, patch history, drift, drain events, health metrics, and replacement tests.