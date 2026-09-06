# Documentation and Auditability Rules

## Purpose
Ensure model-risk decisions, evidence, and control operation can be reconstructed and independently reviewed.

## Scope
Applies to model documentation, evaluation evidence, approvals, change history, exceptions, incidents, and operational controls.

## MUST
- Material model-risk decisions MUST leave a traceable record linking the decision to evidence, model version, deployment context, reviewer, and date.
- Documentation MUST distinguish facts, measurements, assumptions, unresolved uncertainties, and accepted risks.
- Evidence used for approval MUST be reproducible or sufficiently preserved to support independent review.
- Exceptions MUST include scope, owner, expiration, residual risk, and approval evidence.
- Audit records MUST be protected against unauthorized alteration or deletion according to applicable retention requirements.

## MUST NOT
- Teams MUST NOT overwrite historical risk decisions in a way that destroys the prior decision trail.
- Undocumented verbal approval MUST NOT substitute for required recorded approval on material risks.

## SHOULD
- Documentation SHOULD use stable templates and identifiers to reduce ambiguity across model versions and environments.
- Audit artifacts SHOULD be generated automatically from authoritative systems where practical.

## Exceptions
Where evidence cannot be retained because of privacy, licensing, security, or legal constraints, preserve a compliant surrogate record describing what was reviewed, by whom, when, and under which constraints.

## Verification
Inspect model cards, validation reports, exception registers, approval records, immutable logs or version history, and sampled traceability from production model to supporting evidence.