# Workflow: Breaking Change Review

**Trigger:** proposed removal, incompatible schema/semantic/auth/error/limit/lifecycle change. **Goal:** avoid accidental consumer harm and decide whether breaking evolution is justified.

1. Establish current and proposed contract with behavior examples.
2. Inventory affected consumers and criticality.
3. Determine necessity and evaluate compatible alternatives.
4. In parallel: compatibility/migration, security, DX, reliability, economics reviews.
5. Estimate migration cost, timeline, support burden, and blast radius.
6. Define version/deprecation/migration/communication/monitoring/rollback strategy.
7. Record recommendation and unresolved risks.
8. Obtain accountable human approval before commitment.

**Checkpoint:** no approval until affected consumers, alternatives, migration path, and blast radius are evidenced.
**Retries:** analysis may iterate twice after material review findings; repeated unresolved conflict escalates.
**DoD:** approved decision record, migration plan, communication, owners, metrics, exception route, and verification criteria.