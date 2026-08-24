# Model Behavior Policy Rules

## Purpose
Translate safety objectives into testable behavioral requirements.

## Scope
Applies to policies governing model responses, refusals, safe completion, uncertainty, and escalation.

## MUST
- Express safety-critical policy requirements in observable terms that can be evaluated.
- Resolve conflicts between helpfulness and safety using explicit precedence.
- Version policy changes and identify affected evaluations and products.
- Document rationale for material policy changes and expected behavioral impact.

## MUST NOT
- Depend on ambiguous terms without examples or decision criteria for high-risk behavior.
- Change safety-critical policy silently or without regression evaluation.
- Optimize refusal rate alone as a proxy for safety.

## SHOULD
- Include boundary examples and legitimate-use cases to reduce both unsafe compliance and unnecessary refusal.
- Separate universal safety requirements from deployment-specific constraints.

## Exceptions
Deployment-specific deviations require documented scope, risk analysis, tests, and approval.

## Verification
Inspect policy diffs, linked evaluations, boundary tests, approval records, and measured changes in unsafe-compliance and over-refusal rates.
