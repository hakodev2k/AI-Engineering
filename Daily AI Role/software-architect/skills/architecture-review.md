# Skill: Architecture Review

## Purpose
Evaluate a proposed architecture or change independently from its authoring path.

## Inputs
Design/ADR/change proposal, requirements, NFRs, diagrams, contracts, rollout plan, known incidents/metrics.

## Procedure
1. Verify objective and scope before reviewing implementation details.
2. Check traceability from requirements/NFRs to components and decisions.
3. Review boundaries, coupling, state/data ownership, consistency, compatibility, and failure propagation.
4. Review security/trust/data handling and approval boundaries.
5. Review availability, resilience, capacity assumptions, recovery, observability, and operability.
6. Review cost/performance and avoid unsupported optimization claims.
7. Review migration, backward compatibility, rollback, and blast radius.
8. Classify findings: blocker, major, minor, suggestion.
9. For each blocker/major finding include evidence, scenario, impact, recommendation, and owner.
10. Re-review only changed or dependent areas after fixes, then run the final checklist.

## Completion criteria
No unresolved blocker; major risks have owner/mitigation/acceptance; required approvals are explicit; verification evidence is sufficient for the decision stage.

## Retry policy
At most two review-fix cycles before escalating systemic disagreement or repeated incomplete remediation.