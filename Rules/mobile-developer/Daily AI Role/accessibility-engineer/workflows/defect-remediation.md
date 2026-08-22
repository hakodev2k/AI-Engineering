# Workflow: Accessibility Defect Remediation

**Trigger:** confirmed accessibility defect from audit, support, QA, user report, or production monitoring.
**Goal:** remove the user barrier safely and prevent recurrence.

1. Reproduce and capture environment/evidence.
2. Determine affected users, journeys, frequency, severity and release urgency.
3. Identify local vs shared-component root cause.
4. Define expected behavior and smallest safe fix.
5. Engineering implements; add automated guard where deterministic and useful.
6. Manually retest original scenario; run adjacent regression checks.
7. If behavior remains unclear after two loops, escalate to component/platform owner.
8. Close with root cause, lesson, process improvement and prevention action.

**Parallelism:** root-cause investigation and broader duplicate search may run together; implementation waits until expected behavior is agreed.
**Approval:** workaround that knowingly leaves a high-impact barrier requires human product/risk approval.
**Done:** original barrier no longer reproduces, regression evidence exists, and prevention action is recorded.