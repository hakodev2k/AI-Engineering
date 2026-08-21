# Workflow: Production Defect
Trigger: production incident or customer-visible defect.
Goal: restore service safely, then remove root cause.
Inputs: severity, impact, timeline, telemetry, recent changes.
Stages: triage severity and owner; protect users/data; preserve evidence; create one incident timeline; parallelize client/server/data/dependency investigation; identify highest-information hypothesis; mitigate with reversible action; verify recovery signals; implement permanent fix; add regression protection; document learning.
Dependencies: destructive mitigation requires human approval; database repair requires data owner/backup plan.
Checkpoints: containment, root-cause confidence, fix validation, post-release observation.
Retries: bounded; repeated failed mitigation triggers escalation rather than blind retries.
Outputs: mitigation, root cause, fix, tests, prevention action.
DoD: impact ended, cause evidenced, regression test exists where feasible, monitoring catches recurrence, follow-up owners assigned.