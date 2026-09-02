# Incident Response Rules

## Purpose
Provide disciplined response to data platform incidents while preserving evidence, limiting blast radius, and restoring trustworthy service.

## Scope
Applies to outages, data corruption, security events, severe freshness failures, capacity incidents, dependency failures, and platform-wide degradation.

## MUST
- Incidents MUST establish an accountable incident lead and record impact, timeline, actions, evidence, and unresolved risk for material events.
- Containment actions MUST prioritize preventing further corruption, exposure, or blast-radius expansion before nonessential optimization.
- Production conclusions MUST use available logs, metrics, traces, audit records, data reconciliation, or equivalent evidence.
- Recovery MUST include validation of data correctness and consumer-visible behavior before declaring resolution.
- High-risk emergency actions MUST stay within preapproved incident authority; actions beyond that authority MUST obtain explicit human approval.
- Material incidents MUST produce follow-up corrective actions addressing root causes or evidence-bounded contributing factors.

## MUST NOT
- MUST NOT destroy diagnostic evidence merely to restore service faster when preservation is feasible.
- MUST NOT conceal uncertainty or claim root cause without supporting evidence.
- MUST NOT make unrelated production changes during an incident unless necessary to containment or recovery.

## SHOULD
- Prefer reversible containment and restoration steps.
- SHOULD test incident runbooks and communication paths before emergencies.

## Exceptions
Emergency deviations require documented reason, authority, risk, outcome, and retrospective review.

## Verification
Review incident records, timelines, evidence links, reconciliation results, approval records, post-incident actions, and recurring-issue trends.