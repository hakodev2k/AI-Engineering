# TLS Termination Rules

## Purpose
Protect confidentiality, integrity, and identity at load-balancing boundaries.

## Scope
TLS listeners, certificates, cipher policy, protocol versions, SNI, mTLS, re-encryption, and certificate rotation.

## MUST
- Production TLS endpoints MUST use approved protocol versions, cipher policy, and valid certificate chains.
- Private keys MUST be stored and accessed through approved secret/key-management controls with least privilege.
- Certificate renewal and rotation MUST be automated or operationally tracked with expiry alerting.
- Re-encryption to backends MUST validate backend identity when the threat model requires authenticated internal transport.
- mTLS trust stores and client-certificate validation MUST have explicit ownership and rotation procedures.

## MUST NOT
- MUST NOT commit private keys or certificate secrets to source control.
- MUST NOT disable certificate validation to resolve connectivity problems.
- MUST NOT weaken TLS policy without documented risk acceptance and approval.

## SHOULD
- Prefer automated certificate issuance and rotation.
- Prefer end-to-end encryption where traffic crosses untrusted or shared network boundaries.

## Exceptions
Legacy compatibility exceptions require evidence of necessity, compensating controls, expiry date, and security approval.

## Verification
Use configuration inspection and TLS scanners to validate protocol versions, certificate chain, expiry, hostname coverage, cipher policy, mTLS behavior, and backend verification.