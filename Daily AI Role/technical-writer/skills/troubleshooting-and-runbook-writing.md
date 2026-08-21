# Skill: Troubleshooting and Runbook Writing

**Purpose:** help operators/users diagnose and recover safely.
**Trigger:** recurring failure, incident learning, support escalation, operational handoff.
**Inputs:** symptoms, logs/metrics, known causes, recovery actions, escalation policy.
**Preconditions:** safe diagnostic boundaries known.
**Steps:** define symptom → confirm scope/impact → collect minimal evidence → branch by observable conditions → provide reversible actions first → verify recovery → document rollback/escalation → link root-cause prevention.
**Decisions:** choose least-risk diagnostic/action path; stop destructive guessing.
**Constraints:** never expose secrets or prescribe unsafe production actions without approval.
**Outputs:** troubleshooting guide/runbook with checkpoints.
**Quality:** symptom-driven, deterministic where possible, observable success/failure states.
**Verification:** tabletop or test-environment walkthrough.
**Failure:** unknown state or rising blast radius → stop and escalate.
**Stop:** reader can diagnose, recover or escalate with evidence.