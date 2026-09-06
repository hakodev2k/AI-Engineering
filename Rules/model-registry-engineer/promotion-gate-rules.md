# Promotion Gate Rules

## Purpose
Ensure models move through governed lifecycle stages only when required evidence and approvals are present.

## Scope
Candidate, validation, staging, production, archived, or equivalent lifecycle states and their transition criteria.

## MUST
- Every lifecycle transition MUST have explicit entry criteria appropriate to the model's operational impact.
- Production promotion MUST reference the exact model version, evaluation evidence, required approvals, and compatibility checks.
- Automated gates MUST stop the transition when mandatory evidence is missing or invalid.
- Promotion history MUST be immutable and auditable.
- Models classified for enhanced review MUST receive the required human approval before production promotion.

## MUST NOT
- MUST NOT promote a model because a different version passed validation.
- MUST NOT bypass required quality, security, safety, or compliance checks merely to meet a release deadline.
- MUST NOT mutate a production alias without recording the prior and new immutable versions.

## SHOULD
- Use policy-as-code for deterministic promotion checks.
- Keep review depth proportional to operational impact.

## Exceptions
Emergency promotion requires authorized incident context, documented risk, compensating checks, explicit approval, and post-event review.

## Verification
Inspect transition policies, CI/CD gate results, approval records, alias history, and sampled promotion events.