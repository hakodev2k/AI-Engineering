# Privacy and Sensitive Data Rules

## Purpose
Protect personal, regulated, confidential, and high-risk data throughout the feature lifecycle.

## Scope
Feature definitions, storage, lineage, retention, access, logging, training exports, and online serving.

## MUST
- Sensitive features MUST be classified and handled according to applicable policy and legal requirements.
- Feature definitions MUST minimize unnecessary sensitive attributes.
- Retention MUST not exceed documented business or regulatory need.
- Logs and telemetry MUST avoid exposing raw sensitive feature values.
- Derived features MUST be assessed for whether they preserve or infer sensitive information.

## MUST NOT
- MUST NOT copy sensitive features into lower-control environments without authorization.
- MUST NOT use production personal data for development convenience when safer alternatives exist.
- MUST NOT assume transformed data is anonymous without evidence.

## SHOULD
- Use tokenization, aggregation, or minimization where they satisfy the use case.
- Maintain lineage sufficient for deletion or subject-right workflows when required.

## Exceptions
Exceptions require privacy/security review, purpose justification, safeguards, and approval.

## Verification
Review classifications, access policy, retention configuration, logs, lineage, and data-handling assessments.