# Change Impact Rules
## Purpose
Detect hidden quality risk beyond files directly modified by a change.
## Scope
Requirements, code, configuration, schema, dependencies, infrastructure, integrations, and feature flags.
## MUST
- Identify upstream/downstream behavior, shared components, data contracts, permissions, configuration, and operational dependencies affected by material changes.
- Update test scope when dependency or environment changes alter behavior even if application code is unchanged.
- Record uncertain impacts that require specialist review.
## MUST NOT
- Base regression scope only on changed filenames.
- Assume a dependency upgrade is low risk solely because application APIs compile.
## SHOULD
- Use architecture, dependency maps, telemetry, and prior incidents to improve impact analysis.
## Exceptions
Low-risk isolated changes may use lightweight analysis when isolation is evidenced.
## Verification
Review change diff, dependency evidence, impacted journeys, selected tests, and escaped regressions.