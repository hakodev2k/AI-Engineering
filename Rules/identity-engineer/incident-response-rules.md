# Identity Incident Response
## Purpose
Contain and investigate identity compromise with evidence and controlled authority.
## Scope
Account takeover, credential exposure, privilege abuse, federation compromise, and identity outages.
## MUST
- Response MUST preserve relevant authentication, authorization, administrative, and provisioning evidence.
- Containment actions MUST identify affected identities, credentials, sessions, grants, and dependent systems.
- Secret rotation, mass revocation, or high-risk access changes MUST require authorized human approval unless an approved emergency procedure explicitly delegates execution.
- Recovery MUST verify that the attack path is closed or bounded.
## MUST NOT
- Evidence MUST NOT be destroyed merely to restore service faster.
- A compromised credential MUST NOT be considered safe because misuse has not yet been observed.
## SHOULD
- Maintain tested identity-specific playbooks.
## Exceptions
Emergency deviations require incident documentation and retrospective review.
## Verification
Tabletop exercises, incident records, revocation tests, telemetry queries, and post-incident actions.