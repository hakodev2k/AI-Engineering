# Pipeline Incident Workflow

**Trigger:** correctness, freshness, privacy, cost or availability incident.

1. Set severity and incident owner.
2. Contain unsafe writes if needed.
3. Capture evidence before changing state.
4. Run independent investigations in parallel: source, platform, recent changes, data quality, lineage/consumer impact.
5. Consolidate evidence; resolve conflicting hypotheses by tests.
6. Select least-risk recovery path.
7. Execute only within authority; destructive recovery requires human approval.
8. Verify correctness and freshness, not merely job success.
9. Communicate affected data/time/consumers and residual risk.
10. Complete incident record and process improvement.
