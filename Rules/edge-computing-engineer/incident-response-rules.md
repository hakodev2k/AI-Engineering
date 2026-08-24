# Incident Response
## Purpose
Restore edge services safely when failures span remote sites, networks, and fleet versions.
## Scope
Detection, triage, containment, recovery, and learning.
## MUST
- Incident decisions MUST use available logs, metrics, traces, fleet state, and change history as evidence.
- Containment actions MUST consider disconnected nodes and delayed command delivery.
- Recovery MUST verify service health and data consistency, not only process availability.
## MUST NOT
- MUST NOT issue destructive fleet-wide commands without human approval.
- MUST NOT erase diagnostic evidence before required collection.
## SHOULD
- Runbooks SHOULD include site isolation, rollback, credential compromise, and offline recovery scenarios.
## Exceptions
Immediate safety actions may precede full evidence collection when delay creates greater harm; actions must be recorded afterward.
## Verification
Conduct incident drills, inspect timelines and evidence, test remote recovery, and review post-incident actions.