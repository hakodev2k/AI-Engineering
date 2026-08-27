# Safety and Human Oversight Rules

## Purpose
Bound automated vision decisions when failures can cause material harm.

## Scope
Safety-critical perception, identity-related decisions, physical systems, consequential classification, and automated actions.

## MUST
- Hazardous failure modes MUST be identified before deployment and linked to mitigations, detection, fallback, or human oversight.
- Automation authority MUST match validated model capability and system risk.
- Systems requiring human review MUST present sufficient evidence and uncertainty context for meaningful review.
- Changes that expand autonomous authority or weaken safety controls MUST require explicit human approval.

## MUST NOT
- Model confidence scores MUST NOT be treated as calibrated probability unless calibration has been validated for the use case.
- An AI agent MUST NOT silently execute production or safety-impacting actions beyond granted authority.

## SHOULD
- Fail-safe or fail-limited behavior SHOULD be preferred where false confidence creates disproportionate harm.

## Exceptions
Any reduction in oversight requires documented hazard analysis, evidence, alternatives, residual risk, and accountable approval.

## Verification
Review hazard analyses, authority boundaries, calibration evidence, fallback tests, human-factors tests, approvals, and incident drills.