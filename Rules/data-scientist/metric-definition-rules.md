# Metric Definition Rules
## Purpose
Prevent decisions based on ambiguous or manipulable metrics.
## Scope
Business KPIs, model metrics, experiment metrics, and reporting definitions.
## MUST
- Define numerator, denominator, population, time window, exclusions, units, aggregation, and source for material metrics.
- Identify guardrail metrics and known incentives or gaming risks.
- Validate implementation against representative examples.
## MUST NOT
- Compare metric values produced by materially different definitions without disclosure and reconciliation.
- Change a governed metric definition silently.
## SHOULD
- Maintain one authoritative definition for widely reused metrics.
## Exceptions
Local variants must use distinct names and document differences.
## Verification
Inspect metric specifications, SQL/code, test cases, lineage, and historical reconciliation.