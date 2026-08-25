# Threat Modeling Rules

## Purpose
Ensure security design decisions are based on explicit assets, trust boundaries, attacker capabilities, and abuse paths rather than intuition.

## Scope
Applies to new systems, material architecture changes, sensitive data flows, privileged workflows, and externally reachable features.

## MUST
- Security-relevant designs MUST identify assets, actors, entry points, trust boundaries, privileged operations, sensitive data flows, and material dependencies.
- Threats MUST be prioritized using documented impact and plausible exploitability, not severity labels alone.
- High-risk threats MUST have an owner, mitigation, acceptance decision, or explicit escalation before release.
- Material architecture or trust-boundary changes MUST trigger threat-model review.
- Assumptions about identity, network trust, tenant isolation, and dependency behavior MUST be stated and testable.

## MUST NOT
- MUST NOT treat a penetration test, scanner, or compliance checklist as a substitute for threat modeling.
- MUST NOT close a threat solely because exploitation has not yet been observed.
- MUST NOT assume internal callers, private networks, or authenticated users are inherently trusted.

## SHOULD
- SHOULD model abuse cases and attacker goals in addition to technical failure modes.
- SHOULD prefer mitigations that remove attack paths over controls that only detect exploitation.

## Exceptions
Exceptions require documented context, risk, compensating controls, evidence, owner, expiration or review date, and approval appropriate to the residual risk.

## Verification
Review the current architecture/data-flow diagrams, threat register, mitigation links, security tests, and release evidence. Confirm each high-risk threat is traceable to a verified control or approved acceptance.