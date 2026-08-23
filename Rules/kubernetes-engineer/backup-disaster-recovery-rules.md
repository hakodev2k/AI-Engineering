# Backup and Disaster Recovery Rules
## Purpose
Ensure Kubernetes platform state and hosted data can recover from severe failure.
## Scope
Cluster rebuild, configuration recovery, persistent data, recovery objectives, and disaster exercises.
## MUST
- Define recovery time and recovery point objectives for critical platform capabilities and data.
- Keep sufficient declarative configuration and protected backups to rebuild required state.
- Test restore and rebuild procedures at a frequency proportional to business impact.
- Document dependencies outside the cluster that are required for recovery.
## MUST NOT
- Claim disaster recovery readiness from backup-job success alone.
- Store the only recoverable copy within the same failure boundary it protects against.
## SHOULD
- Automate reproducible cluster reconstruction and verify it periodically.
## Exceptions
Non-critical reproducible environments may use rebuild-only recovery when explicitly accepted.
## Verification
Review recovery objectives, backup reports, restore tests, rebuild exercises, dependency inventory, and measured recovery times.