# TLS and Certificate Rules

## Purpose
Protect confidentiality, authenticity, and continuity for CDN-delivered traffic.

## Scope
Applies to viewer TLS, origin TLS, certificates, protocol policy, cipher policy, and certificate lifecycle.

## MUST
- Public delivery endpoints MUST use valid certificates covering every served hostname.
- Origin connections carrying sensitive or authoritative content MUST authenticate the intended origin.
- Certificate renewal MUST be automated or have monitored lead-time sufficient for manual recovery.
- Deprecated protocol versions and cryptographically weak configurations MUST be disabled according to current security policy.
- Certificate ownership and expiration alerting MUST be explicit.

## MUST NOT
- MUST NOT disable certificate validation to bypass origin TLS failures.
- MUST NOT deploy private keys through source control or general-purpose configuration.
- MUST NOT make production TLS changes without a compatibility and rollback assessment.

## SHOULD
- Prefer automated certificate issuance and rotation.
- Test representative legacy clients before tightening compatibility where they are supported.
- Monitor handshake failures by edge region and protocol.

## Exceptions
Compatibility exceptions require affected-client evidence, security risk assessment, bounded duration, compensating controls, and security approval.

## Verification
Run certificate-chain and protocol scans; inspect CDN and origin TLS configuration; validate renewal alerts; verify handshake telemetry and certificate expiration inventory.