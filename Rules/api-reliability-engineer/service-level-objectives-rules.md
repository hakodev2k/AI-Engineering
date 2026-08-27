# Service Level Objectives Rules

## Purpose
Define measurable reliability targets that connect API behavior to user impact and engineering decisions.

## Scope
Applies to production APIs and material dependencies owned or governed by the API Reliability Engineer.

## MUST
- Every production API MUST define availability and latency SLIs from the consumer perspective, with explicit good-event criteria and measurement windows.
- SLOs MUST identify the population measured, exclusions, aggregation method, target, window, and authoritative telemetry source.
- Reliability targets MUST reflect business criticality and dependency capability rather than arbitrary round numbers.
- Error-budget consumption MUST be reviewable by service, endpoint or critical operation where practical.
- Changes to SLO definitions MUST preserve historical comparability or document the discontinuity.

## MUST NOT
- MUST NOT claim an SLO is met using infrastructure health alone when clients can still receive failed or unusable responses.
- MUST NOT exclude failures merely because they are inconvenient to measure.
- MUST NOT silently redefine an SLI after an incident to improve reported compliance.

## SHOULD
- Critical user journeys SHOULD have operation-specific SLOs when aggregate API metrics hide meaningful failure modes.
- SLOs SHOULD be paired with error-budget policies that guide release and reliability investment decisions.

## Exceptions
Exceptions require documented rationale, measurement limitations, user impact, compensating evidence, owner, review date, and approval for material risk.

## Verification
Review SLO specifications, telemetry queries, dashboards, historical calculations, alert configuration, and sampled request outcomes. Recompute representative windows independently when feasible.