# Coverage and Risk Rules

## Purpose
Evaluate automation coverage by risk, behavior, and failure impact rather than percentage alone.

## Scope
Applies to test planning, automation gaps, code/feature coverage, and release confidence.

## MUST
- Coverage decisions MUST prioritize failure impact, likelihood, complexity, change frequency, and detectability.
- High-risk untested behavior MUST be explicitly recorded with compensating controls or acceptance.
- Coverage metrics MUST be interpreted alongside assertion quality and scenario relevance.
- New architecture boundaries MUST trigger review of integration and contract coverage.

## MUST NOT
- MUST NOT equate line/code coverage percentage with sufficient product validation.
- MUST NOT automate low-value cases at the expense of known critical gaps solely for metric improvement.
- MUST NOT hide excluded areas from coverage reporting.

## SHOULD
- Use risk matrices or equivalent explicit prioritization for significant systems.
- Reassess coverage after incidents and major design changes.

## Exceptions
Accepted coverage gaps require owner, rationale, risk, and review point.

## Verification
Inspect risk-to-test mapping, coverage exclusions, escaped defects, assertion depth, and accepted-gap records.