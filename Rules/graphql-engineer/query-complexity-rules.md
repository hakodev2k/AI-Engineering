# Query Complexity Rules

## Purpose
Prevent GraphQL flexibility from creating unbounded server cost or denial-of-service risk.

## Scope
Applies to query depth, field multiplicity, list expansion, fragments, aliases, and computed cost enforcement.

## MUST
- Production GraphQL endpoints MUST enforce a documented query-cost or equivalent bounded-complexity policy.
- Complexity calculation MUST account for nested list expansion and known expensive fields.
- Limits MUST be derived from measured service capacity and realistic client workloads.
- Rejected operations MUST fail deterministically without executing partial expensive work.
- Limit changes MUST include before/after load evidence.

## MUST NOT
- MUST NOT rely only on maximum query depth when breadth can still create excessive work.
- MUST NOT exempt authenticated users from resource safeguards by default.
- MUST NOT advertise higher capacity than downstream dependencies can sustain.

## SHOULD
- SHOULD provide clients enough diagnostics to rewrite rejected operations safely.
- SHOULD maintain separate budgets when trusted internal workloads have materially different requirements.

## Exceptions
Higher limits require documented workload evidence, risk assessment, capacity validation, and approval from the accountable service owner.

## Verification
Use complexity test cases, load tests, pathological-query tests, production metrics, and configuration inspection.