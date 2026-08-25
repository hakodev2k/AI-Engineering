# Secret Inventory Rules

## Purpose
Maintain authoritative knowledge of credential existence, ownership, exposure, and operational dependency.

## Scope
Managed and discovered secrets across applications, infrastructure, CI/CD, endpoints, cloud services, and third parties.

## MUST
- Production-capable secrets MUST be represented in an authoritative inventory with owner, system, environment, privilege scope, issuer, storage location, expiry, and rotation status.
- Discovery findings MUST be reconciled against the inventory and unexplained secrets MUST be investigated.
- Orphaned, ownerless, duplicate, and stale credentials MUST have a tracked remediation decision.
- Inventory access MUST follow least privilege because metadata can reveal attack paths.

## MUST NOT
- The inventory MUST NOT store plaintext secret values.
- A secret MUST NOT be considered governed merely because its application is inventoried.
- Unknown ownership MUST NOT be silently replaced with a guessed owner.

## SHOULD
- Inventory SHOULD be populated automatically from authoritative providers where practical.
- Coverage SHOULD be measured by environment and credential class, not only by raw counts.

## Exceptions
Manual inventory is acceptable only when automation is infeasible and reconciliation frequency, owner, risk, and retirement plan are documented.

## Verification
Compare provider inventories, discovery results, CMDB/service ownership data, expiry reports, and sampled consuming systems. Review unresolved inventory drift and its age.