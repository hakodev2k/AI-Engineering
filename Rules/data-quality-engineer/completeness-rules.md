# Completeness Rules
## Purpose
Detect missing data before it causes incorrect decisions.
## Scope
Rows, fields, partitions, events, and expected populations.
## MUST
- Critical completeness dimensions MUST have explicit expected baselines or thresholds.
- Missing partitions, required fields, and expected entity populations MUST be detected within defined freshness windows.
- Completeness incidents MUST identify affected scope and downstream consumers.
## MUST NOT
- MUST NOT treat a non-empty dataset as proof of completeness.
- MUST NOT suppress missing-data alerts without evidence.
## SHOULD
- Completeness SHOULD be measured by meaningful segments where aggregate checks can hide failures.
## Exceptions
Threshold changes require evidence of legitimate source behavior and documented impact.
## Verification
Compare expected versus observed counts, null profiles, partition inventories, and segment-level metrics.