# TLS and Transport Security

## Purpose
Protect confidentiality, integrity, and peer identity across gateway connections.

## Scope
Client-to-gateway and gateway-to-upstream TLS, mTLS, certificates, ciphers, and protocol policy.

## MUST
- Sensitive traffic MUST use approved encrypted transport.
- Gateway-to-upstream identity MUST be validated where the trust model requires it.
- Certificate expiry and rotation MUST be monitored before service impact.
- TLS policy changes MUST be evaluated for client compatibility and security impact.

## MUST NOT
- MUST NOT disable certificate validation in production.
- MUST NOT permit obsolete protocols or cryptographic settings contrary to project security policy.
- MUST NOT expose private key material through configuration, logs, or diagnostics.

## SHOULD
- Automated certificate lifecycle management SHOULD be used.
- mTLS SHOULD be considered where service identity requires cryptographic assurance.

## Exceptions
Compatibility exceptions require bounded scope, documented threat impact, compensating controls, expiry, and security approval.

## Verification
Use TLS scanners, certificate inspection, handshake tests, expiry monitoring, configuration review, and negative trust tests.