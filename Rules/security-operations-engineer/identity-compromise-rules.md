# Identity Compromise Rules

## Purpose
Respond safely to suspected compromise of user, service, and privileged identities.

## Scope
Credential theft, token theft, session hijacking, MFA abuse, privilege escalation, and anomalous identity activity.

## MUST
- Investigations MUST identify active sessions, tokens, authentication factors, privilege changes, and reachable resources.
- Confirmed or high-confidence compromise MUST revoke affected sessions and credentials according to severity and approved playbooks.
- Privileged identity compromise MUST trigger review of actions performed during the suspected exposure window.
- Recovery MUST verify trusted authentication factors and remove unauthorized persistence or delegation.

## MUST NOT
- MUST NOT rely on password reset alone when tokens, sessions, keys, or federation trust may remain valid.
- MUST NOT disable logging or conditional-access controls to simplify investigation.

## SHOULD
- Identity response SHOULD correlate endpoint, cloud, directory, application, and network evidence.

## Exceptions
Delayed revocation requires documented operational necessity, compensating controls, and senior approval.

## Verification
Inspect sign-in records, session revocations, credential rotations, privilege audits, and post-recovery monitoring.