# Patch Management

## Purpose
Reduce vulnerability exposure without introducing uncontrolled service disruption.

## Scope
Windows OS, Microsoft components, drivers, firmware dependencies, and update infrastructure.

## MUST
- Patch policy MUST define severity-based timelines, maintenance windows, exception ownership, and restart behavior.
- Updates MUST be staged through representative deployment rings when operational risk warrants it.
- Critical vulnerabilities MUST be risk-assessed promptly using exposure and exploitability evidence.
- Patch completion MUST be measured from endpoint state, not merely deployment initiation.
- Emergency production patching outside normal controls MUST receive human approval.

## MUST NOT
- MUST NOT defer patches indefinitely without documented risk acceptance.
- MUST NOT assume a successful update job means the system is compliant.
- MUST NOT broadly pause security updates to work around an isolated incompatibility.

## SHOULD
- Maintain rollback/recovery options for high-impact updates.
- Track failed, pending-reboot, and unreachable systems separately.

## Exceptions
Require owner, reason, affected assets, compensating controls, expiration, and approval.

## Verification
Use update inventory, vulnerability scans, deployment reports, reboot state, service health, event logs, and sampled version checks.