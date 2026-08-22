# Incident Response Rules

## Purpose
Define disciplined operational behavior during service incidents and infrastructure failures.

## Scope
Applies to production incidents, degraded services, security-impacting outages, and major platform failures.

## MUST
- Incidents MUST have an identified owner or coordinator and a clear severity.
- Immediate mitigation MUST prioritize user impact, data integrity, and system safety before optimization or cleanup.
- Evidence such as logs, metrics, traces, deployment history, and configuration changes MUST be preserved when feasible.
- Hypotheses MUST be tested against evidence before broad corrective changes are made.
- Major incidents MUST produce follow-up actions for root cause, prevention, observability, and process gaps.

## MUST NOT
- MUST NOT make multiple unrelated high-risk changes simultaneously when isolation is possible.
- MUST NOT hide incident impact or claim resolution before critical behavior is verified.
- MUST NOT delete evidence needed for later analysis unless required for immediate safety.

## SHOULD
- Prefer reversible mitigations and clear communication intervals.
- Separate mitigation, root-cause analysis, and permanent remediation.

## Exceptions
Immediate emergency action may precede normal review when delay would materially worsen impact; actions and rationale MUST be recorded afterward.

## Verification
Review incident timeline, evidence, change records, mitigation verification, post-incident analysis, and tracked corrective actions.