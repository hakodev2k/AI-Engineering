# Dataset Requirements Rules

## Purpose
Define the intended use, quality bar, and acceptance criteria for synthetic datasets before generation begins.

## Scope
Applies to synthetic data created for model training, evaluation, analytics, testing, simulation, privacy-preserving sharing, and system validation.

## MUST
- Define the target use case, consumers, prohibited uses, and expected decision impact before selecting a generation method.
- Specify required population, feature, label, temporal, class-balance, and edge-case coverage in measurable terms.
- Record which properties must match real data and which properties may intentionally differ.
- Define acceptance thresholds for validity, fidelity, privacy, bias, leakage, and downstream utility before dataset production.
- Identify safety-critical or regulated attributes whose synthetic representation requires stronger review.
- Define failure conditions that invalidate a dataset even when aggregate metrics appear acceptable.

## MUST NOT
- Generate a production-bound dataset from an undefined request such as "make realistic data" without explicit acceptance criteria.
- Treat row count or superficial resemblance as sufficient evidence of quality.
- Infer unstated business or safety requirements when the dataset will influence consequential decisions.
- Reuse acceptance thresholds from another project without validating that the use case and risk profile are equivalent.

## SHOULD
- Express quality goals as testable assertions tied to downstream tasks.
- Prioritize requirements by consequence of failure rather than convenience of measurement.
- Separate mandatory contract requirements from exploratory quality objectives.

## Exceptions
Any missing requirement must be documented with the reason, risk, expected impact, and compensating validation. High-risk omissions require human approval before generation proceeds.

## Verification
Review the dataset specification, acceptance-test definitions, risk classification, intended-use statement, and traceability from requirements to validation metrics. CI or review gates SHOULD reject release candidates lacking measurable acceptance criteria.