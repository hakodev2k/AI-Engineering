# Regression Strategy Rules

## Purpose
Align automated regression coverage with product risk rather than raw test count.

## Scope
Applies to suite composition, critical paths, change-based selection, regression gaps, and release confidence.

## MUST
- Critical business journeys and high-impact failure modes MUST have explicit regression coverage or documented alternative controls.
- Regression scope MUST consider change risk, historical defects, integration boundaries, and production impact.
- Removed or disabled tests MUST trigger review of the risk they previously controlled.
- Repeated escaped defects MUST result in coverage or prevention analysis.

## MUST NOT
- MUST NOT use test count alone as evidence of adequate coverage.
- MUST NOT permanently exclude unstable critical tests without replacement controls.
- MUST NOT duplicate identical assertions across layers merely to inflate coverage.

## SHOULD
- Maintain a fast high-confidence core suite and broader scheduled coverage.
- Periodically prune obsolete low-value tests.

## Exceptions
Unautomated risk requires explicit manual verification or another control with owner and rationale.

## Verification
Map risks to tests, review escaped defects, inspect disabled tests, measure suite signal, and validate critical-path execution.