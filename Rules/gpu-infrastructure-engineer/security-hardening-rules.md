# GPU Infrastructure Security Hardening Rules

## Purpose
Reduce the attack surface of accelerator hosts, management planes, workload runtimes, and supporting services.

## Scope
Applies to GPU nodes, operating systems, device plugins, management interfaces, firmware, remote access, credentials, and network controls.

## MUST
- GPU hosts MUST follow an approved hardening baseline appropriate to their operating system and workload model.
- Management interfaces MUST be isolated from untrusted workload networks and protected by strong authentication and least privilege.
- Firmware, drivers, device plugins, and privileged infrastructure components MUST be tracked for security advisories and patched according to risk.
- Secrets MUST be supplied through approved secret-management mechanisms and MUST NOT be embedded in images or startup scripts.
- Security-relevant configuration changes MUST be auditable and attributable.

## MUST NOT
- Authentication, certificate validation, host security controls, or network policy MUST NOT be disabled merely to restore GPU functionality.
- Shared administrative credentials MUST NOT be used when individual or workload identities are available.
- Secrets, access tokens, private keys, or sensitive tenant data MUST NOT be logged.

## SHOULD
- GPU infrastructure SHOULD minimize exposed services and unnecessary host packages.
- Security posture SHOULD be continuously checked for configuration drift.

## Exceptions
Exceptions require documented threat impact, compensating controls, expiration, and security-owner approval.

## Verification
Use configuration inspection, IAM review, vulnerability scanning, network-policy tests, secret scanning, audit logs, and controlled access tests.