# Service-to-Service Authentication Rules

## Purpose
Ensure machine-to-machine communication uses attributable, verifiable identities rather than network position or shared secrets alone.

## Scope
Applies to APIs, RPC, messaging, service meshes, batch jobs, and internal platform services.

## MUST
- Each service or workload MUST authenticate as a distinct non-human identity appropriate to its trust boundary.
- Receiving services MUST validate issuer, audience, integrity, expiry, and intended use of credentials or assertions.
- Credentials MUST be scoped to the minimum services and actions required.
- Identity rotation and revocation MUST be operationally supported.

## MUST NOT
- MUST NOT trust source IP or subnet as the sole proof of service identity.
- MUST NOT reuse one high-privilege credential across unrelated services.
- MUST NOT accept tokens intended for another audience or environment.

## SHOULD
- Prefer short-lived credentials obtained through workload identity over static secrets.
- Service authentication SHOULD be mutually verifiable where threat models justify it.

## Exceptions
Legacy integrations require documented risk, compensating transport and monitoring controls, migration owner, approval, and expiry.

## Verification
Inspect credential issuance, token validation, service configuration, rotation behavior, and negative tests for replay, wrong audience, expired credentials, revoked identities, and cross-service credential misuse.