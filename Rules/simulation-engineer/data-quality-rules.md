# Simulation Data Quality Rules
## Purpose
Protect model conclusions from defective input and reference data.
## Scope
Measured, synthetic, historical, generated, and reference datasets.
## MUST
- Define data lineage, units, coordinate systems, timestamps, missing-value semantics, and quality checks.
- Detect range, schema, duplication, temporal alignment, and integrity failures before execution.
- Separate synthetic data from observed evidence in validation claims.
## MUST NOT
- silently impute or discard material observations.
- use leaked future or target information in predictive simulation inputs.
## SHOULD
- Version datasets and validation rules together.
## Exceptions
Known data defects require quantified impact or conservative treatment.
## Verification
Inspect lineage, schema validation, quality reports, transformations, and dataset hashes.