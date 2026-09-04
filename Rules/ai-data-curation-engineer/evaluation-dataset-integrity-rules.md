# Evaluation Dataset Integrity Rules
## Purpose
Protect evaluation datasets as trustworthy evidence for model quality and safety claims.
## Scope
Benchmarks, gold sets, challenge sets, regression suites, and human-evaluation samples.
## MUST
- Evaluation datasets MUST have controlled provenance, stable versions, documented scoring assumptions, and contamination checks.
- Material edits to evaluation data MUST be reviewed for impact on historical comparability.
- High-stakes evaluation sets MUST include difficult and failure-oriented cases relevant to intended use.
## MUST NOT
- Evaluation items MUST NOT be altered after observing model outputs merely to improve reported performance.
- Test labels MUST NOT be exposed to training or tuning workflows without explicit reclassification of the set.
## SHOULD
- Evaluation datasets SHOULD include independently reviewed examples for critical capabilities and risks.
## Exceptions
Exceptions require documented rationale and impact on metric comparability.
## Verification
Inspect access logs, version history, contamination scans, benchmark manifests, scoring code, and change reviews.