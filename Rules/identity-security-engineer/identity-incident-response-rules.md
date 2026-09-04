# Identity Incident Response Rules

## Purpose
Define containment, evidence, and recovery requirements for suspected identity compromise.

## Scope
Applies to account takeover, credential theft, token theft, privilege abuse, federation compromise, directory compromise, and identity-provider incidents.

## MUST
- Incident response MUST distinguish affected identities, credentials, sessions, privileges, applications, and trust relationships.
- Containment MUST prioritize revocation of active attack paths while preserving required forensic evidence.
- Suspected privileged compromise MUST trigger review of privilege changes and persistence mechanisms.
- Recovery MUST verify credential rotation, session invalidation, policy integrity, and restored trusted administration.
- Conclusions MUST be supported by logs, configuration, endpoint evidence, or equivalent observable facts.

## MUST NOT
- Password reset alone MUST NOT be assumed sufficient when tokens, federation, recovery factors, or privileged persistence may remain compromised.
- Evidence MUST NOT be destroyed merely to accelerate recovery.
- A compromised identity MUST NOT be re-enabled before containment criteria are met.

## SHOULD
- Predefine playbooks for common identity compromise scenarios.
- Include downstream relying parties in containment analysis.

## Exceptions
Exceptions require incident commander or accountable security approval with documented risk.

## Verification
Review incident exercises, revocation tests, forensic procedures, recovery checklists, and completed incident evidence.