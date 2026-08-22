# Feature Flag Governance Rules

## MUST
- Every active flag MUST have a unique key, type, owner, created date, lifecycle state, default behavior, and cleanup trigger.
- Temporary `release` and `experiment` flags MUST have an expiry date within policy.
- Every flag MUST define behavior when the flag provider is unavailable or returns no value.
- Retirement MUST identify the permanent branch using evidence, not naming convention or current default alone.
- Every retirement MUST run a repository reference scan before and after code removal.
- Relevant tests MUST cover permanent behavior after retirement.
- Protected/high-risk flag retirement MUST have explicit human approval.
- Remaining references after retirement MUST be explained or removed.
- Operational failures in validation/scanning MUST block verification.
- `retired` MUST mean obsolete runtime branch/registration is removed and verification passed.

## MUST NOT
- MUST NOT use feature flags to bypass authentication, authorization, encryption, validation, audit, or other security controls.
- MUST NOT create temporary flags without owner, expiry, or cleanup trigger.
- MUST NOT silently convert an expired temporary flag into a permanent operational flag.
- MUST NOT delete a production kill switch without explicit human approval.
- MUST NOT change production rollout state merely to make tests or verification pass.
- MUST NOT assume a flag is unused because one search pattern finds no references.
- MUST NOT remove branch tests without preserving regression coverage for the permanent behavior.
- MUST NOT report retirement complete while prohibited code/config references remain.
- MUST NOT use unbounded retry loops.
- MUST NOT broaden tool permissions when repository/config access is denied.

## SHOULD
- SHOULD keep flag evaluation close to the boundary where behavior diverges instead of spreading checks across many layers.
- SHOULD prefer one flag key per behavior decision and avoid aliases unless migration requires them.
- SHOULD keep temporary flag lifetime short and review flags before expiry.
- SHOULD define rollout metrics and stop conditions before production rollout begins.
- SHOULD use an expand-contract approach if flag branches differ in persisted data shape or public contracts.
- SHOULD retain historical retirement evidence outside runtime configuration when auditability is useful.
- SHOULD make scanner patterns repository-specific through policy configuration rather than editing script logic.