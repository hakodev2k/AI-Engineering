# Skill: Cost Allocation

## Purpose
Attribute spend to accountable owners and business dimensions without hiding uncertainty.

## Trigger
Unallocated spend, showback/chargeback work, ownership disputes, new account hierarchy, or reporting redesign.

## Inputs
Billing line items, resource metadata, org hierarchy, service catalog, shared-service drivers, ownership records.

## Preconditions
Billing scope and period are known; source data is fresh enough for the decision.

## Procedure
1. Define reporting dimensions and allocation goals.
2. Measure current allocation coverage.
3. Map direct ownership first.
4. Resolve metadata gaps with service/catalog ownership.
5. Select causal drivers for shared costs.
6. Keep residual unallocated spend explicit.
7. Test reconciliation back to source bill.
8. Review disputed/high-value mappings.
9. Publish ownership and exception process.
10. Measure coverage and stale metadata over time.

## Decisions
Prefer deterministic, auditable mapping over complex heuristics. Escalate policy disputes to Finance/business owners.

## Output
Allocation rules, coverage metrics, unresolved pool, owners, and reconciliation evidence.

## Quality gate
Allocated + unallocated + credits/adjustments MUST reconcile to the scoped bill within documented rounding tolerance.
