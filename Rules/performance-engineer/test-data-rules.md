# Performance Test Data Rules
## Purpose
Prevent unrealistic data from invalidating performance conclusions.
## Scope
Database size, distributions, cardinality, cache state, payloads, and tenant/user patterns.
## MUST
- Use representative data volume and distributions for critical tests.
- Include worst-reasonable cardinalities and skew where they affect plans or hotspots.
- Protect sensitive production data through approved sanitization or synthetic alternatives.
## MUST NOT
- Copy sensitive production data into test environments without authorization and controls.
- Use tiny datasets to validate data-scale performance claims.
## SHOULD
- Version reusable synthetic datasets and generation parameters.
## Exceptions
Reduced datasets require documented scope limits.
## Verification
Inspect dataset statistics, generation scripts, privacy controls, cardinalities, and test assumptions.