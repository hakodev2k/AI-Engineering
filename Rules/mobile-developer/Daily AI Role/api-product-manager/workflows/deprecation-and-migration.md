# Workflow: Deprecation and Migration

**Trigger:** API/version/capability should be replaced or retired. **Goal:** migrate consumers safely and retire only with evidence.

1. Document rationale and target replacement.
2. Inventory consumers, usage, criticality, owners, and contractual obligations.
3. Produce migration guide, compatibility differences, tooling/examples, support plan, dates, and exception process.
4. Obtain lifecycle/deprecation approval.
5. Communicate through agreed channels and record acknowledgements where required.
6. Track migration per consumer; parallelize support work across independent consumers.
7. Review blockers at checkpoints; adjust plan only through explicit decision record.
8. Before retirement, verify remaining usage, exceptions, downstream dependencies, monitoring/support updates, and irreversible-action approval.
9. Authorized operator retires capability; verify post-retirement state.

**Retry/failure:** failed migrations get bounded diagnosis/fix/retest cycles (max 2 per unchanged hypothesis); repeated failure escalates with evidence.
**DoD:** consumers migrated or have approved disposition, retirement approved/executed, evidence captured, and follow-up complete.