# Identity and Privilege Rules

## Purpose
Limit host access and privileged execution to authenticated, attributable, least-privilege actions.

## Scope
Applies to local accounts, SSH access, sudo, PAM, service identities, break-glass access, and privileged automation.

## MUST
- Human administrative access MUST use individually attributable identities; shared privileged accounts require a controlled break-glass design.
- Privilege MUST be granted by least privilege and scoped to the commands, hosts, or roles required.
- Administrative authentication MUST follow the project security baseline, including strong key or MFA-backed mechanisms where supported.
- Service accounts MUST be non-interactive unless interactive access is explicitly required and reviewed.
- Joiner, mover, leaver, and emergency-access paths MUST include timely revocation.

## MUST NOT
- Root remote login MUST NOT be enabled merely for convenience.
- Credentials, private keys, or sudo passwords MUST NOT be embedded in scripts or repositories.
- Broad passwordless sudo MUST NOT be granted without a documented operational requirement and compensating controls.
- Access controls MUST NOT rely solely on obscurity such as nonstandard ports.

## SHOULD
- Centralize identity where appropriate while preserving emergency access for control-plane outages.
- Use short-lived credentials and certificate-backed SSH where practical.
- Periodically review dormant identities and privilege grants.

## Exceptions
Emergency privilege escalation requires reason, bounded duration, auditability, and post-event review. Permanent exceptions require owner and explicit security approval.

## Verification
Review account databases, SSH/PAM/sudo configuration, identity-provider mappings, authentication logs, dormant accounts, privileged command logs, and access-review evidence.