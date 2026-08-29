# Safety and Risk Rules

## Purpose
Ensure AI product decisions identify, bound, and control foreseeable harm before exposure scales.

## Scope
Applies to product design, launch gating, misuse analysis, sensitive domains, and post-launch changes.

## MUST
- Material harms, misuse paths, affected populations, and severity MUST be documented before launch.
- High-risk use cases MUST have explicit mitigation, escalation, monitoring, and human-approval requirements.
- Safety controls MUST have measurable acceptance criteria and failure-handling behavior.
- Residual risk MUST be assigned to an accountable decision owner.

## MUST NOT
- MUST NOT weaken a safety control merely to improve engagement, conversion, or launch speed without explicit approval.
- MUST NOT treat absence of reported incidents as evidence that a risk does not exist.
- MUST NOT ship materially expanded capability without reassessing misuse and harm scenarios.

## SHOULD
- Safety reviews SHOULD include adversarial and edge-case evaluation.
- Irreversible or high-impact actions SHOULD require stronger user confirmation or human oversight.

## Exceptions
Any exception requires documented rationale, evidence, residual risk, compensating controls, and approval from the responsible authority.

## Verification
Inspect risk assessments, safety test results, approval records, control configurations, monitoring plans, and incident criteria.