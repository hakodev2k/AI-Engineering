# Secrets and TLS Rules
## Purpose
Protect PostgreSQL credentials and data in transit.
## Scope
Passwords, certificates, connection strings, TLS, rotation, and secret distribution.
## MUST
- Store credentials outside source control and rotate them through approved secret-management mechanisms.
- Require verified encrypted transport for untrusted network paths.
- Plan credential and certificate rotation without relying on a single simultaneous cutover.
## MUST NOT
- Log passwords, full credential-bearing connection strings, private keys, or authentication tokens.
- Disable certificate verification as a permanent workaround.
## SHOULD
- Prefer short-lived or centrally managed credentials where supported.
## Exceptions
Diagnostic exceptions require bounded scope, approval, and restoration verification.
## Verification
Inspect secret stores, repository history/scans, TLS settings, certificate validation, and rotation tests.