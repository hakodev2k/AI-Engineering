# Fault Injection Rules

## Purpose
Validate API behavior under realistic failures before those failures occur unexpectedly.

## Scope
Covers dependency latency, errors, packet loss, resource exhaustion, instance loss, quota exhaustion, and partial outages.

## MUST
- Fault experiments MUST state hypothesis, scope, expected safe behavior, abort conditions, and success criteria.
- Production experiments MUST have explicit human approval, bounded blast radius, active observation, and a tested stop mechanism.
- Faults MUST model plausible failure modes rather than arbitrary chaos.
- Experiments MUST verify both failure containment and recovery.
- Security and data-integrity controls MUST remain in force during experiments.

## MUST NOT
- MUST NOT inject destructive faults into production without authorization and recovery safeguards.
- MUST NOT run experiments when observability is insufficient to detect harm.
- MUST NOT interpret a single successful experiment as proof against all related failure modes.

## SHOULD
- Experiments SHOULD begin in lower-risk environments and increase realism incrementally.
- Findings SHOULD feed tests, runbooks, capacity models, and architecture decisions.

## Exceptions
Emergency diagnostic experiments require explicit incident authority, narrow scope, recorded risk, and post-action review.

## Verification
Inspect experiment plans, approvals, telemetry, abort tests, results, recovery evidence, and resulting corrective actions.