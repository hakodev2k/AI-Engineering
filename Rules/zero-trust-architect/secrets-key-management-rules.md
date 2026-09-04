# Secrets and Key Management Rules

## Purpose
Prevent credentials and cryptographic material from becoming durable trust shortcuts or unmanaged attack paths.

## Scope
Applies to application secrets, API credentials, certificates, signing keys, encryption keys, service credentials, and emergency credentials.

## MUST
- Production secrets and private keys MUST be stored in approved secret-management or key-management systems with access control and auditability.
- Credentials MUST have defined owners, purpose, scope, lifecycle, and rotation or renewal mechanism.
- Short-lived or dynamically issued credentials MUST be preferred when supported by the platform.
- Cryptographic keys protecting high-value assets MUST use protection appropriate to their sensitivity, including managed key services or hardware-backed protection when required by the threat model.
- Secret rotation procedures MUST account for dependent systems and MUST support controlled rollback or dual-key transition where necessary.
- Access to secret-management systems MUST itself be least-privilege, strongly authenticated, and auditable.
- Suspected secret exposure MUST trigger a documented containment and rotation process.

## MUST NOT
- Secrets or private keys MUST NOT be committed to source control, embedded in container images, written into logs, or placed in broadly readable configuration.
- Long-lived shared credentials MUST NOT be used when unique workload identity is reasonably available.
- Secret values MUST NOT be copied into tickets, chat systems, documentation, or diagnostic artifacts without an approved secure mechanism.
- Security controls MUST NOT be weakened merely to avoid credential rotation complexity.

## SHOULD
- Automated issuance and rotation SHOULD replace manual credential handling wherever practical.
- Different environments and trust zones SHOULD use different keys and credentials.
- Certificate and key expiry SHOULD be monitored before it can create an availability incident.

## Exceptions
Exceptions require technical justification, exact secret scope, risk, compensating controls, owner, expiry, and security approval. Emergency rotations affecting production require accountable human approval unless an established incident procedure explicitly authorizes immediate containment.

## Verification
Run secret scanning, inspect secret-store policies, credential lifetimes, certificate inventories, key permissions, rotation records, audit logs, deployment manifests, and incident procedures. Verify revoked credentials no longer authenticate.