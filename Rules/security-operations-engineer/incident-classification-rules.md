# Incident Classification Rules

## Purpose
Apply consistent incident declarations and severity decisions.

## Scope
Potential or confirmed cybersecurity events affecting confidentiality, integrity, availability, identity, or trust.

## MUST
- Incident severity MUST reflect observed impact, credible blast radius, asset sensitivity, attacker capability, persistence, and recovery complexity.
- Classification changes MUST record the evidence and decision owner.
- Incidents involving privileged identities, regulated data, or material production disruption MUST receive senior review.
- Uncertainty MUST be represented explicitly rather than converted into unsupported certainty.

## MUST NOT
- MUST NOT downgrade severity to satisfy response metrics.
- MUST NOT delay incident declaration when containment or notification obligations depend on it.

## SHOULD
- Classification SHOULD be reassessed as new evidence changes impact or scope.

## Exceptions
Any deviation from the standard matrix requires documented justification and accountable approval.

## Verification
Inspect incident records for severity rationale, timestamps, reassessments, approvals, and consistency with the classification standard.