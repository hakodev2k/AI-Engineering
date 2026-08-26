# Consumer Impact Rules
## Purpose
Prioritize quality work by actual downstream consequence.
## Scope
Consumers, critical use cases, dashboards, models, APIs, operations, and decisions.
## MUST
- Severity decisions MUST consider affected consumers, business criticality, decision impact, duration, and recoverability.
- Critical consumers MUST be identifiable for major data products.
- Quality incidents MUST communicate whether data is trusted, degraded, quarantined, or invalid for specified uses.
## MUST NOT
- MUST NOT prioritize solely by number of failed rows when a small subset can have high consequence.
- MUST NOT claim no impact without checking known downstream dependencies.
## SHOULD
- Quality investment SHOULD focus on high-impact failure modes and recurring consumer pain.
## Exceptions
When consumer inventory is incomplete, uncertainty must be stated and investigation widened.
## Verification
Review lineage, usage telemetry, stakeholder evidence, severity rationale, and communication records.