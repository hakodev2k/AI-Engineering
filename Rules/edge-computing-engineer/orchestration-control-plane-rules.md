# Orchestration and Control Plane
## Purpose
Prevent centralized orchestration dependencies from making remote sites fragile.
## Scope
Schedulers, controllers, desired-state systems, and remote management planes.
## MUST
- Edge workloads MUST define behavior when the central control plane is unreachable.
- Desired-state operations MUST be idempotent and safely resumable.
- Control-plane authority and local autonomy boundaries MUST be explicit.
## MUST NOT
- MUST NOT require a synchronous central control-plane round trip for safety-critical local behavior unless explicitly designed and justified.
- MUST NOT permit stale control messages to override newer authoritative state.
## SHOULD
- Local agents SHOULD cache sufficient validated policy for bounded autonomous operation.
## Exceptions
Central-only control requires documented availability dependency and failure procedure.
## Verification
Disconnect the control plane, replay commands, inspect version ordering, and test convergence after reconnection.