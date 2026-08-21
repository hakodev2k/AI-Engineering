# Workflows

## Workflow 1 — Measure → Diagnose → Guard → Measure
**Trigger:** background work may outlive a parent task.  
**Goal:** reduce orphan rate to zero without false kills.  
**Inputs:** controlled workload, policy, runtime logs, registry, process metrics.  
**Baseline:** record cancel p50/p95, live-owned descendants after cancel, CPU/RAM/API activity, stale leases.  
**Stages:** (1) reproduce and capture ownership; (2) classify escape path; (3) integrate registry/process-group launch; (4) add cancel state machine; (5) add completion barrier; (6) rerun same workload; (7) independent verification.  
**Responsible agents:** Investigator → Implementation → Verification.  
**Tools:** process_guard.py, runtime hooks, test runner, OS metrics.  
**Outputs:** baseline/after metrics, lifecycle ledger, audit events, verification report.  
**Checkpoints:** ownership record valid before launch; identity valid before terminate; zero-live check before completion.  
**Metrics:** orphan rate, cancel p95, false-kill rate, force-escalation rate, post-cancel resource activity.  
**Retry policy:** maximum 2 implementation hypotheses per failure class before re-diagnosis.  
**Stop conditions:** pass when zero controlled owned survivors and zero unrelated kills; stop/escalate on ambiguous ownership.  
**Failure path:** revert to observe-only; collect missing identity/launcher evidence; never broaden kill matching.  
**Verification:** independent fixture run.  
**Definition of Done:** baseline and after comparison recorded, tests pass, metrics meet policy, residual risks documented.

## Workflow 2 — Runtime Cancellation
**Trigger:** user stop, parent cancellation, shutdown, expired lease, resource emergency.  
**Goal:** deterministically stop only owned descendants.  
**Inputs:** task ID, registry, current process evidence, policy.  
**Baseline:** current live-owned descendant count.  
**Stages:** set `cancelling` → verify identity → graceful group termination → bounded wait → re-inspect → optional policy-controlled force escalation → final zero-live verification → terminal state.  
**Responsible agent:** deterministic host hook; LLM is not the authority.  
**Tools:** process_guard.py plus OS-specific adapter.  
**Outputs:** terminal state and audit trail.  
**Checkpoints:** identity verification immediately before each destructive action.  
**Metrics:** cancellation duration, survivors, escalation count.  
**Retry policy:** no more than `max_cancel_attempts`.  
**Stop conditions:** zero owned live processes or attempts exhausted.  
**Failure path:** mark `orphaned`/`needs-human`, alert operator, retain evidence.  
**Verification:** completion hook independently confirms zero owned descendants.  
**Definition of Done:** no hidden survivor and explicit terminal status.

## Workflow 3 — Stale-Lease Reconciliation
**Trigger:** heartbeat older than lease + grace period.  
**Goal:** recover abandoned ownership records after coordinator crash.  
**Inputs:** registry, policy, OS evidence.  
**Stages:** list stale → identity-check → inspect process tree → if gone, close stale record → if live, classify → observe-only report or bounded cancellation according to policy.  
**Retry policy:** one reconciliation pass per scan; next pass occurs on the next scheduled host scan, not an inner infinite loop.  
**Stop conditions:** every stale record classified.  
**Failure path:** corrupted/ambiguous record becomes `needs-human`; no signal sent.  
**Definition of Done:** stale records have evidence-backed state.
