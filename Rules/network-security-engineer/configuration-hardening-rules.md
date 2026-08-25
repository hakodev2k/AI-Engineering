# Configuration Hardening
## Purpose
Reduce attack surface and configuration drift on network infrastructure.
## Scope
Routers, switches, firewalls, gateways, controllers, load balancers, and appliances.
## MUST
- Unnecessary services and management interfaces MUST be disabled or restricted.
- Security-relevant baseline settings MUST be versioned or otherwise auditable.
- Deviations from approved hardening baselines MUST be documented.
- Configuration backups MUST be protected and recoverable.
## MUST NOT
- Insecure legacy protocols MUST NOT remain enabled without approved necessity.
- Production hardening MUST NOT be weakened solely to simplify troubleshooting.
## SHOULD
- Automated compliance checks SHOULD detect drift from approved baselines.
## Exceptions
Require operational justification, threat assessment, compensating controls, owner, and expiry.
## Verification
Use configuration diffing, compliance checks, service scans, backup restore tests, and peer review.