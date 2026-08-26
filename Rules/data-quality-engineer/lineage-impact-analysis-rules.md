# Lineage and Impact Analysis Rules
## Purpose
Understand how quality defects and changes propagate.
## Scope
Source-to-consumer lineage, transformations, dependencies, and blast radius.
## MUST
- Critical data products MUST have sufficient lineage to identify upstream origins and downstream consumers.
- Breaking or high-risk changes MUST include impact analysis before execution.
- Incident scope MUST use available lineage evidence rather than assumptions alone.
## MUST NOT
- MUST NOT claim complete blast-radius analysis when lineage is known to be incomplete.
- MUST NOT make destructive upstream corrections without considering downstream replay effects.
## SHOULD
- Lineage SHOULD be captured automatically from executable pipelines where practical.
## Exceptions
Manual lineage is acceptable when automation is unavailable if ownership and update cadence are explicit.
## Verification
Trace representative fields end-to-end, inspect dependency graphs, compare lineage with pipeline definitions, and review impact records.