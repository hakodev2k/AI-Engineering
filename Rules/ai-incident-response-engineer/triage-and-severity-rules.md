# Triage and Severity Rules

## Purpose
Classify AI incidents consistently so response urgency reflects actual user, safety, security, legal, and operational impact.

## Scope
Applies from initial incident intake through severity reassessment.

## MUST
- Triage MUST assess user impact, blast radius, safety risk, security exposure, data sensitivity, reversibility, persistence, and dependency impact.
- Severity MUST be based on observed or credibly bounded impact rather than stakeholder pressure or responder confidence.
- Potential unauthorized data disclosure, material safety-control bypass, uncontrolled high-impact agent action, or widespread production failure MUST receive immediate senior review.
- Severity MUST be reassessed when evidence materially changes.
- Unknown blast radius for a credible high-impact failure MUST be treated conservatively until bounded.
- Triage decisions MUST record evidence, assumptions, uncertainty, and the next validation step.

## MUST NOT
- Incidents MUST NOT be downgraded solely because a root cause is unknown.
- AI-generated explanations MUST NOT be treated as proof of root cause or impact.
- A low incident count MUST NOT imply low severity when affected actions are high consequence.

## SHOULD
- Teams SHOULD maintain explicit severity examples for AI-specific incidents.
- Triage SHOULD separate confirmed facts from hypotheses and unverified reports.

## Exceptions
Any deviation from the standard severity model requires documented rationale, risk assessment, and approval from the designated incident authority.

## Verification
Review incident records for consistent severity criteria, reassessment timestamps, evidence links, and documented uncertainty. Compare classifications against established severity policy.