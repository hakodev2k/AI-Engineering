# Security Property Rules

## Purpose
Formalize and verify security guarantees with explicit threat, trust, and attacker models.

## Scope
Applies to authorization, confidentiality, integrity, authentication, information flow, protocol security, and privilege boundaries.

## MUST
- Define attacker capabilities, trusted components, protected assets, and security boundaries before making security claims.
- Express authorization and privilege invariants over all reachable states.
- Model replay, substitution, confused-deputy, downgrade, and state-transition abuse where relevant.
- Separate cryptographic assumptions from protocol properties.
- Require evidence that implementation identities, keys, roles, and trust roots match the verified model.

## MUST NOT
- Treat secrecy of implementation details as a security assumption.
- Model an attacker weaker than the documented threat model merely to make verification succeed.
- Claim confidentiality when side channels or observable outputs intentionally excluded from the model can reveal the protected information.
- Weaken security controls or trust assumptions without explicit human approval.

## SHOULD
- Prefer noninterference or explicit information-flow properties when confidentiality depends on data-flow restrictions.
- Validate formal assumptions with security tests and configuration inspection.

## Exceptions
Excluded attack classes require documented scope, rationale, compensating controls, and residual-risk approval.

## Verification
Use proof/model-checking results, threat-model review, implementation/configuration inspection, penetration/security tests, and traceability from each claim to its formal property.