# Feature Engineering Rules
## Purpose
Keep features valid, explainable, and consistent across training and serving.
## Scope
Feature definitions, transformations, joins, and encodings.
## MUST
- Define feature semantics, source, availability time, transformation, and default behavior.
- Ensure training and serving use equivalent feature logic.
- Test high-impact transformations on boundary and missing-value cases.
## MUST NOT
- Introduce features whose production availability or latency is unknown.
- Duplicate feature logic across training and serving without consistency checks.
## SHOULD
- Centralize reusable feature definitions and ownership.
## Exceptions
Document intentional training-serving differences and validate their effect.
## Verification
Compare offline and online feature samples, lineage, transformation tests, and serving latency.