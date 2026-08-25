# Certificate Lifecycle Rules

## Purpose
Prevent outages and trust failures caused by unmanaged certificate issuance, expiry, or private-key handling.

## Scope
TLS, mTLS, code-signing, client, service, and internal PKI certificates managed by the role.

## MUST
- Certificates MUST have accountable ownership, approved issuer, intended identities, usage constraints, expiry monitoring, and renewal path.
- Private keys MUST be protected according to certificate impact and MUST NOT be exposed during enrollment or renewal.
- Renewal automation MUST verify successful deployment and service acceptance before declaring completion.
- Compromised certificates MUST follow approved revocation and replacement procedures.

## MUST NOT
- Expiry monitoring MUST NOT depend only on manual calendar reminders for production certificates.
- Wildcard or broadly scoped certificates MUST NOT be used when narrower identities are practical and materially safer.
- Certificate validation MUST NOT be disabled to bypass trust or hostname failures.

## SHOULD
- Prefer short-lived automatically renewed certificates.
- Maintain issuer and trust-chain observability.

## Exceptions
Manual renewal or broad scope requires documented constraint, owner, compensating monitoring, and review date.

## Verification
Inspect inventories, issuer policies, private-key controls, expiry alerts, renewal runs, deployed certificate chains, and revocation evidence.