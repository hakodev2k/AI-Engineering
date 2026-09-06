# Backup and Restore Rules
## Purpose
Ensure critical production state can actually be recovered.
## Scope
Databases, object stores, configuration state, and other durable production data.
## MUST
- Critical data MUST have backup and recovery controls aligned with defined RPO and RTO.
- Readiness MUST use restore-test evidence for critical datasets; backup job success alone is insufficient.
- Recovery procedures MUST identify credentials, dependencies, ordering, validation, and authority required to restore.
- Backup retention and protection MUST satisfy applicable security, privacy, and business requirements.
- Changes that alter data format or storage topology MUST re-evaluate recovery compatibility.
## MUST NOT
- Backup existence MUST NOT be represented as proven recoverability without restore evidence.
- Recovery procedures MUST NOT depend on undocumented tribal knowledge.
- Backup access MUST NOT exceed operational need.
## SHOULD
- Periodically test restoration into isolated environments.
- Measure actual recovery duration against RTO.
## Exceptions
If full restore testing is infeasible, use partial restoration, integrity checks, conservative assumptions, and accepted risk.
## Verification
Review backup policy, restore tests, RPO/RTO measurements, access controls, and recovery runbooks.