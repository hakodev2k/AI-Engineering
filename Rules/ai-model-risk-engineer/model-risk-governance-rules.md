# Model Risk Governance Rules

## Purpose
Establish accountable governance for identifying, assessing, accepting, and monitoring risks introduced by AI models and model-driven systems.

## Scope
Applies to production and pre-production AI models, including generative, predictive, classification, ranking, recommendation, and agentic systems.

## MUST
- Every in-scope model MUST have a documented owner, intended use, prohibited use, risk tier, and review cadence.
- Risk tiering MUST consider impact magnitude, reversibility, user exposure, autonomy, data sensitivity, and regulatory or contractual obligations.
- Material risk decisions MUST record the rationale, evidence, decision owner, residual risk, and review date.
- Governance controls MUST scale with risk; higher-risk systems MUST require stronger evidence and approval.
- Model retirement, major version changes, and material capability expansion MUST trigger governance review.

## MUST NOT
- Models MUST NOT be deployed solely because technical metrics are acceptable when material safety, legal, security, or operational risks remain unresolved.
- Risk acceptance MUST NOT be inferred from silence, missing review, or schedule pressure.

## SHOULD
- Governance SHOULD use standardized risk taxonomy and approval criteria across teams.
- Decision records SHOULD be concise enough to review and complete enough to support future audits.

## Exceptions
Any governance exception must document scope, reason, duration, compensating controls, residual risk, approver, and expiration date.

## Verification
Inspect model inventory, risk classifications, decision records, approval evidence, and review timestamps. Verify higher-risk systems have stronger review evidence than lower-risk systems.