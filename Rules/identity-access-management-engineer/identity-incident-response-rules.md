# Identity Incident Response Rules

## Purpose
Contain compromised identities while preserving evidence and restoring trustworthy access.

## Scope
Credential compromise, token theft, privilege abuse, account takeover, federation compromise, identity-provider incidents, and unauthorized grants.

## MUST
- Response MUST distinguish containment, eradication, recovery, and evidence preservation.
- Compromised sessions and credentials MUST be revoked based on assessed blast radius, not only the initially observed token.
- Privilege and policy changes made by a compromised identity MUST be reviewed for persistence and secondary access paths.
- Recovery MUST establish a trustworthy authentication path before restoring sensitive access.

## MUST NOT
- MUST NOT destroy relevant audit evidence during cleanup.
- MUST NOT rotate high-impact production secrets or identity keys without coordination and required approval.
- MUST NOT assume password reset alone removes active sessions or alternate credentials.

## SHOULD
- Maintain tested playbooks for common identity compromise scenarios and federation-key emergencies.

## Exceptions
Emergency deviations require incident-command authorization and retrospective documentation.

## Verification
Run tabletop or technical exercises; inspect revocation coverage, evidence retention, recovery steps, timelines, and post-incident actions.