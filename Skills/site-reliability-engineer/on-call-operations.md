# On-Call Operations

## Purpose
Design and operate a sustainable on-call system that provides timely production response without depending on heroics or causing chronic responder fatigue.

## When to use
Use when establishing or reviewing rotations, escalation, handoff, paging quality, responder readiness, or on-call workload.

## Inputs
Service ownership, alert volume, incident history, staffing, time zones, escalation paths, runbooks, and response targets.

## Preconditions
Services and alert ownership must be mapped to accountable teams.

## Context to inspect
Page frequency, after-hours load, false positives, response times, unresolved alerts, handoff practices, staffing depth, and recurring manual actions.

## Core knowledge
On-call is a reliability mechanism, not free operational capacity. Sustainable rotations require actionable paging, adequate staffing, documented procedures, escalation, and engineering time to remove repeated failure sources.

## Procedure
1. Map services and pages to explicit owners.
2. Define severity and response expectations.
3. Measure page volume, timing, and actionability.
4. Remove or downgrade alerts that do not require immediate action.
5. Ensure critical pages have runbooks and dashboards.
6. Define primary, secondary, and specialist escalation paths.
7. Establish shift handoff for active risks and degraded systems.
8. Track recurring pages as reliability work, not normal load.
9. Review on-call health regularly with quantitative data.
10. Allocate engineering capacity to eliminate the largest toil and noise sources.

## Decision points
Page only when immediate human action can reduce impact. Use ticketing or business-hours alerts for non-urgent issues. Add specialist escalation when the primary responder cannot safely diagnose a subsystem.

## Common failure patterns
Paging on every warning, relying on one expert, undocumented escalations, alert fatigue, excessive after-hours toil, and treating repeated pages as acceptable operations.

## Verification
Measure actionable-page ratio, response time, repeated-page frequency, escalation effectiveness, and responder load before and after improvements.

## Expected output
Clear rotation ownership, escalation model, actionable paging, handoff process, and a prioritized on-call improvement backlog.

## Stop conditions
Escalate when staffing cannot meet safe coverage, critical services have no owner, or responder fatigue creates material operational risk.