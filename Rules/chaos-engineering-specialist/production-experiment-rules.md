# Production Experiment Rules

## Purpose
Govern chaos testing in live environments where experiments can affect real users, data, or operational capacity.

## Scope
Applies to any fault injection, resilience probe, or game-day activity executed against production systems.

## MUST
- Production execution MUST require explicit human approval appropriate to the expected blast radius and risk.
- The plan MUST define owner, schedule, user impact, abort criteria, rollback or cleanup, communication channel, and monitoring coverage.
- On-call or incident responders responsible for affected services MUST be informed before execution unless an approved program explicitly defines an equivalent process.
- Critical dependencies and change activity MUST be checked immediately before starting.

## MUST NOT
- Production chaos MUST NOT be executed during an active incident, unstable deployment, or known capacity emergency unless incident leadership explicitly authorizes it.
- Experiment automation MUST NOT silently expand scope beyond the approved target set.
- A successful pre-production result MUST NOT substitute for production-specific risk assessment.

## SHOULD
- Production experiments SHOULD begin with a canary scope and short duration.
- Experiments SHOULD avoid unrelated high-risk change windows.

## Exceptions
Emergency resilience validation requires documented incident or business justification, bounded scope, designated authority, and explicit approval.

## Verification
Inspect approvals, preflight checklist, service health, target scope, communications, monitoring, and post-experiment cleanup evidence.