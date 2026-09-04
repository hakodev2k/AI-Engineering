# Identity Verification Rules

## Purpose
Ensure human and machine identities are strongly established before authorization decisions rely on them.

## Scope
Applies to workforce, customer, partner, service, workload, and administrative identities.

## MUST
- Identity providers MUST use authoritative lifecycle sources and MUST have defined joiner, mover, and leaver processes.
- Privileged and sensitive-resource access MUST require phishing-resistant MFA or an explicitly approved equivalent control where technically feasible.
- Authentication assurance requirements MUST be proportional to resource sensitivity and transaction risk.
- Identity proofing, account recovery, credential reset, and enrollment flows MUST be treated as security-sensitive authentication paths.
- Machine identities MUST be unique, attributable, scoped, and lifecycle-managed.
- Authentication events MUST generate auditable telemetry sufficient to investigate anomalous access.

## MUST NOT
- Shared human accounts MUST NOT be used for privileged access except for documented break-glass scenarios.
- Authentication success MUST NOT automatically imply authorization to all resources reachable from the same environment.
- Long-lived credentials MUST NOT be used where short-lived or renewable credentials are reasonably available.
- Recovery mechanisms MUST NOT be materially weaker than the primary authentication path.

## SHOULD
- Adaptive authentication SHOULD incorporate device posture, location anomalies, impossible travel, behavior, and resource sensitivity.
- Federation SHOULD be preferred over duplicating unmanaged local identities across systems.
- Privileged identities SHOULD be separate from normal productivity identities.

## Exceptions
Exceptions require documented need, risk, compensating controls, owner, expiry, and approval. Privileged-access exceptions require security approval.

## Verification
Inspect identity-provider configuration, MFA policies, recovery procedures, service-account inventories, credential lifetimes, authentication logs, and lifecycle tests. Test that disabled identities cannot authenticate and that privileged paths enforce the required assurance level.