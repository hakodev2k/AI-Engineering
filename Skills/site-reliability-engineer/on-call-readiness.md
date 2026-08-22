# On-Call Readiness

## Purpose
Prepare services and responders for sustainable, effective production support with enough context, access, automation, and escalation paths to act safely.

## When to use
Use before onboarding a service to on-call, rotating responders, launching critical functionality, or when on-call burden indicates operational gaps.

## Inputs
Service inventory, runbooks, alerts, dashboards, access model, escalation policy, dependency ownership, and incident history.

## Context to inspect
Inspect alert volume, pages outside working hours, undocumented dependencies, privileged access, common incidents, deployment controls, support boundaries, and responder experience.

## Core knowledge
On-call is a reliability feedback mechanism, not a substitute for engineering quality. Responders need actionable alerts, safe access, bounded authority, and practiced procedures. Chronic toil and noisy pages are system defects.

## Procedure
1. Define service ownership and escalation boundaries.
2. Verify responders can access required telemetry and controls.
3. Review alerts for actionability and urgency.
4. Create or validate runbooks for common failure modes.
5. Document dependency contacts and external escalation paths.
6. Exercise access and recovery procedures in non-production or controlled drills.
7. Establish handoff expectations and current-risk notes.
8. Track page frequency, time to acknowledge, and time to mitigate.
9. Convert recurring manual actions into engineering work.
10. Review responder load and psychological sustainability regularly.

## Decision points
Page immediately only for urgent, actionable user-impacting conditions. Route lower urgency signals to tickets or dashboards. Automate remediation only when preconditions and rollback behavior are well understood.

## Common failure patterns
Paging on symptoms with no action, stale runbooks, missing production access, undocumented ownership, hero-dependent recovery, and accepting recurring pages as normal.

## Verification
Run an on-call readiness drill, confirm access works, validate sample alerts reach the correct responder, and ensure common incidents can be diagnosed from documented evidence.

## Expected output
A service ready for support with actionable paging, tested access, runbooks, escalation paths, and measurable on-call health.

## Stop conditions
Do not accept on-call ownership when critical access, telemetry, ownership, or safe recovery procedures are absent; escalate readiness gaps before launch.