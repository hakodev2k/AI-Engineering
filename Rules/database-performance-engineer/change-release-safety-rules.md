# Change and Release Safety Rules
## Purpose
Prevent tuning changes from causing correctness, availability, or rollback failures.
## Scope
Database configuration, indexes, schema, maintenance policy, engine settings, and performance releases.
## MUST
- Classify production performance changes by blast radius, reversibility, lock/resource risk, and rollback method.
- Test material changes in a representative environment when practical.
- Require explicit human approval before production configuration changes, destructive SQL, irreversible migrations, or security weakening.
## MUST NOT
- Execute a high-risk production change merely because analysis recommends it.
- Combine unrelated high-risk tuning changes when doing so prevents attribution or safe rollback.
## SHOULD
- Roll out reversible changes incrementally with guardrails.
## Exceptions
Incident mitigation may use expedited approval while preserving auditability and rollback criteria.
## Verification
Inspect change records, approvals, test evidence, rollout plan, monitoring gates, and rollback procedure.