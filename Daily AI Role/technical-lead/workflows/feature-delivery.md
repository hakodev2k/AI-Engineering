# Feature Delivery Workflow

## Trigger
Feature or cross-component change accepted for delivery.

## Stages
1. **Intake** — Technical Lead clarifies outcome, constraints, NFRs, deadlines, approvals.
2. **Explore** — Repository Explorer maps current behavior and boundaries.
3. **Plan** — Technical Lead decomposes work, dependencies, risks, owners, verification.
4. **Execute** — Implementation Owners work only on non-conflicting bounded scopes.
5. **Integrate** — Technical Lead checks contracts and cross-workstream assumptions.
6. **Review** — Independent Reviewer evaluates risk-sensitive changes.
7. **Verify** — Verification Owner runs system quality gates against acceptance criteria.
8. **Release readiness** — confirm rollback, telemetry, operational docs, approvals.
9. **Handoff** — publish final evidence, known risks, follow-up items, ownership.

## Checkpoints
No implementation before plan; no release readiness with blocking review findings; no handoff without verification evidence.

## Rework
Maximum two author-review loops before Technical Lead re-assesses design/scope.

## Escalation
Escalate requirement conflict, external dependency breach, unbounded migration, security/data risk, or missing production authority.