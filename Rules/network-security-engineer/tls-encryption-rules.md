# Transport Encryption
## Purpose
Protect network traffic confidentiality, integrity, and endpoint authenticity.
## Scope
TLS, mTLS, IPsec, VPN encryption, and certificate-dependent network services.
## MUST
- Sensitive traffic crossing untrusted or lower-trust boundaries MUST use approved encryption.
- Certificate validation MUST verify identity and trust chain.
- Protocol and cipher configuration MUST meet current project security baselines.
- Certificate expiry and renewal MUST be operationally monitored.
## MUST NOT
- Invalid-certificate checks MUST NOT be disabled in production to bypass failures.
- Private keys MUST NOT be embedded in source or unsecured configuration.
## SHOULD
- mTLS SHOULD be considered for high-trust service-to-service boundaries.
## Exceptions
Require threat assessment, compensating controls, approval, and explicit expiry.
## Verification
Use configuration inspection, protocol scanners, certificate inventory, expiry monitoring, and connection tests.