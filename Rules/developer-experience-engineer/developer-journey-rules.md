# Developer Journey Rules

## Purpose
Ensure developer workflows are designed from evidence, not assumptions.

## Scope
Applies to onboarding, local development, build, test, debug, review, release, and support journeys.

## MUST
- Critical developer journeys MUST have an explicit start state, success state, owner, and measurable friction signals.
- Workflow changes MUST identify affected developer personas and compatibility constraints.
- Material journey regressions MUST be triaged using reproducible evidence.
- High-frequency or high-cost friction MUST be prioritized using observed impact rather than anecdote alone.

## MUST NOT
- MUST NOT optimize a single workflow step while knowingly making the end-to-end journey materially worse without documented trade-offs.
- MUST NOT declare friction resolved solely because documentation was added.
- MUST NOT require hidden tribal knowledge for routine workflows.

## SHOULD
- Journeys SHOULD minimize context switching, redundant input, and manual state reconstruction.
- Representative developers SHOULD validate material workflow changes before broad rollout.

## Exceptions
Exceptions require documented context, affected users, alternatives considered, risk, expected duration, and verification. Material regressions require owner approval.

## Verification
Review journey tests, telemetry, support trends, task completion evidence, developer feedback, and before/after measurements.