# Incident Analysis Rules

## Purpose
Use distributed traces as evidence during incidents without overstating what traces prove.

## Scope
Applies to triage, root-cause analysis, dependency diagnosis, regression analysis, and post-incident review.

## MUST
- Incident conclusions MUST distinguish directly observed trace evidence from hypotheses and inference.
- Suspected root causes MUST be corroborated with logs, metrics, configuration, deployment history, or other independent evidence when available.
- Investigators MUST account for sampling, missing spans, retries, asynchronous boundaries, and clock issues before drawing causal conclusions.
- High-impact incidents MUST preserve relevant trace evidence long enough for review when operational policy permits.

## MUST NOT
- MUST NOT declare the longest span to be the root cause without validating why it is long.
- MUST NOT treat one anomalous trace as representative of fleet-wide behavior without supporting evidence.
- MUST NOT alter production instrumentation during an incident in a way that creates material risk without approval.

## SHOULD
- Compare affected and unaffected traces across versions, regions, dependencies, and request classes.
- Record trace identifiers for reproducible incident evidence.

## Exceptions
Exceptions require documented evidence limitations and clearly bounded confidence.

## Verification
Review incident notes for trace IDs, competing hypotheses, corroborating signals, sampling limitations, and evidence supporting the final causal statement.
