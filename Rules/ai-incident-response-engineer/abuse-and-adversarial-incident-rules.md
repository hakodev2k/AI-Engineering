# Abuse and Adversarial Incident Rules

## Purpose
Respond to deliberate attempts to exploit AI behavior while separating abuse from ordinary product defects.

## Scope
Applies to prompt injection, jailbreak campaigns, automated abuse, resource exhaustion, tool misuse, data extraction attempts, and coordinated adversarial behavior.

## MUST
- Investigation MUST preserve indicators of abuse, relevant request patterns, identities or pseudonymous identifiers where lawful, and affected controls.
- Containment MUST target the abusive mechanism while minimizing unnecessary impact on legitimate users.
- Adversarial incidents MUST evaluate whether exploitation crosses authorization, data, tool, or tenant boundaries.
- Repeated bypasses MUST trigger control-level analysis rather than endless exact-string blocking.
- Rate limits, abuse controls, and account actions MUST follow applicable policy and authority.
- Exploit details with material misuse potential MUST be access-controlled during response.

## MUST NOT
- Responders MUST NOT conduct retaliatory actions against suspected attackers.
- Attribution MUST NOT be claimed without evidence sufficient for the intended decision.
- Broad user restrictions MUST NOT be imposed without assessing proportionality and bypass risk.

## SHOULD
- Convert sanitized adversarial examples into regression evaluations.
- Coordinate with security and trust/safety functions for cross-domain abuse.

## Exceptions
Emergency broad restrictions may be used when active abuse creates severe harm and narrower controls are unavailable; they require review and removal criteria.

## Verification
Inspect abuse telemetry, control changes, authorization evidence, regression tests, and post-mitigation attack rates.