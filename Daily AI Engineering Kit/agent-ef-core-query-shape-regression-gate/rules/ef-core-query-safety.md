# EF Core Query Safety Rules

## MUST
- Trace the affected execution path before editing a query.
- Preserve global query filters, tenant boundaries, authorization predicates, ordering, pagination, and result semantics unless the requirement explicitly changes them.
- Run the static query-shape scan before and after remediation.
- Build and run targeted tests after query edits.
- Capture generated SQL or equivalent runtime evidence for confirmed performance findings when feasible.
- Separate facts, hypotheses, decisions, and unresolved risks.
- Require an independent verifier for performance-sensitive or production-facing changes.

## MUST NOT
- Remove `Where`, query filters, tenant predicates, or authorization conditions merely to simplify SQL.
- Add `AsEnumerable`, `ToList`, or other materialization before server-side filters to bypass translation problems without explicit justification.
- Add schema/index changes, production configuration changes, or breaking API behavior without human approval.
- Change tracking/no-tracking semantics on write paths unless correctness is proven.
- Claim improved performance from source-code appearance alone.
- Silence scanner findings by changing the policy unless an authorized maintainer deliberately approves the policy change.

## SHOULD
- Prefer projection when only a subset of columns/navigation data is needed.
- Use `AsNoTracking` for verified read-only paths where identity/tracking behavior is unnecessary.
- Prefer bounded queries and pagination for large result sets.
- Evaluate split versus single-query behavior when loading multiple collections.
- Batch persistence rather than calling `SaveChanges` repeatedly in loops.
- Use async EF Core terminal operators in async request/job paths.
