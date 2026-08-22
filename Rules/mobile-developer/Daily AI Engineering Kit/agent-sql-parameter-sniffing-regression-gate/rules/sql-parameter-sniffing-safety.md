# SQL Parameter Sniffing Safety Rules

## MUST
- Reproduce the regression with at least two materially different parameter shapes before attributing it to parameter sniffing.
- Preserve exact query text, parameter values or safe distributions, timing evidence, row counts, and plan identifiers used for comparison.
- Compare a known-good baseline against the suspected plan under equivalent environment and data conditions.
- Treat query hints, forced plans, index changes, schema changes, and database-scoped settings as approval-required actions.
- Keep production investigations read-only unless explicit human approval authorizes a change.
- Record whether evidence is fact, hypothesis, or decision.

## MUST NOT
- Do not declare parameter sniffing solely because one execution is slow.
- Do not run destructive SQL, clear the production plan cache, force a plan, add an index, or change compatibility/database settings automatically.
- Do not log secrets or sensitive literal values when distributions or hashed labels are sufficient.
- Do not weaken security or transaction isolation to improve benchmark numbers.
- Do not retry a failed benchmark more than two times without escalation.

## SHOULD
- Prefer representative low-, median-, and high-selectivity parameter classes.
- Prefer Query Store or captured plan evidence when available.
- Test the smallest reversible mitigation before broad query or database changes.
- Keep implementation and independent verification roles separate for production-impacting recommendations.
