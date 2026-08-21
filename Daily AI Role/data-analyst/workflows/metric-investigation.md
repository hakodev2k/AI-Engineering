# Workflow: Metric Investigation

**Trigger:** KPI moves unexpectedly or dashboards disagree.

1. Freeze exact metric definition and comparison window.
2. Determine whether issue is data/definition defect or real behavior change.
3. Parallel lanes: freshness/instrumentation, denominator/numerator, segment composition, trusted-source reconciliation.
4. If data defect is material, block narrative publication and escalate to data owner.
5. If data is fit, decompose aggregate and segment movement; test contradictory segments and sensitivity windows.
6. Rank likely drivers by evidence strength, not narrative appeal.
7. Record unresolved alternatives and next discriminating test.
8. Publish decision brief; if canonical definition must change, require metric-owner approval.

**Failure loop:** Failure → Root Cause → Lesson → Process Improvement → Future Prevention.
