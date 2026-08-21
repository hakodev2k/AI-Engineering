# Data Leakage Rules
## Purpose
Prevent unrealistically optimistic model results.
## Scope
Feature construction, splitting, preprocessing, training, and evaluation.
## MUST
- Ensure every feature is available at the actual prediction time.
- Fit learned preprocessing only on training data within each evaluation fold.
- Use entity-, group-, or time-aware splits when random splitting can leak information.
## MUST NOT
- Use future outcomes, post-event fields, target-derived aggregates, or duplicated entities across boundaries without justified design.
## SHOULD
- Maintain explicit leakage tests for high-risk pipelines.
## Exceptions
Research-only oracle features must be clearly labeled and excluded from deployable performance claims.
## Verification
Review feature timestamps, split logic, preprocessing fit boundaries, lineage, and leakage tests.