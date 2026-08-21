# Workflows

## Workflow 1 — Plan and Admit Delegation
**Trigger:** Root task is about to use subagents.
**Goal:** Produce and enforce a bounded delegation plan.
**Inputs:** Task, policy, usage history.
**Baseline:** Record expected worker count, depth, token/tool/time estimates, synthesis reserve.
**Context:** Root task ID and current ledger.
**Stages:** Observe task → decompose → estimate → budget → deterministic plan-check → atomic spawn admission.
**Responsible agent:** Budget Planner, then Orchestrator.
**Tools:** Policy, ledger, `budget_guard.py`.
**Outputs:** Validated plan and reservations.
**Checkpoints:** Before first spawn; before each nested spawn.
**Metrics:** Planned/actual descendants, depth, concurrency, reserved tokens.
**Retry policy:** One re-plan with smaller fan-out.
**Stop conditions:** Valid plan admitted; or second plan invalid and delegation disabled/escalated.
**Failure path:** Fall back to sequential/root execution if correctness remains feasible.
**Verification:** Every live child has a reservation tied to the root.
**Definition of Done:** No unbudgeted child exists and synthesis headroom remains.

## Workflow 2 — Runtime Reconcile and Threshold Response
**Trigger:** Child usage event, heartbeat, completion, failure, timeout, or cancellation.
**Goal:** Keep actual aggregate usage bounded and visible.
**Inputs:** Reservation, actual metrics, terminal status.
**Baseline:** Reserved values from admission.
**Stages:** Validate ownership → update monotonic actuals → compare thresholds → release unused reservation on terminal event → recompute remaining budget.
**Responsible agent:** Runtime ledger adapter.
**Tools:** Usage telemetry, ledger.
**Outputs:** Updated budget snapshot and warnings/denials.
**Checkpoints:** 75% soft threshold; every hard limit; child terminal state.
**Metrics:** Tokens, tool calls, descendants, active concurrency, wall time, estimate error.
**Retry policy:** One retry for transient ledger write; fail closed afterward.
**Stop conditions:** Event reconciled or ledger marked unsafe.
**Failure path:** Freeze new spawns and escalate inconsistent accounting.
**Verification:** Root totals never decrease except releasable reservations; consumed usage never refunded.
**Definition of Done:** Ledger reconciled and invariants hold.

## Workflow 3 — Fan-out Incident Containment
**Trigger:** Actual fan-out exceeds plan, spawn velocity anomaly, hard limit, or orphan tree.
**Goal:** Stop cost growth while preserving useful work.
**Inputs:** Live tree, ledger, completed/partial outputs.
**Baseline:** Planned fan-out and budget.
**Stages:** Freeze admissions → snapshot evidence → rank descendants → preserve results → cancel redundant/newest work → bounded grace → synthesize or escalate.
**Responsible agent:** Orchestrator plus Independent Verification Agent.
**Tools:** Agent registry, cancellation API, ledger, audit log.
**Outputs:** Containment record, preserved results, residual risks.
**Checkpoints:** Freeze confirmed; cancellation progress; post-grace orphan scan.
**Metrics:** Time-to-freeze, post-detection token spend, cancelled descendants, orphan count, partial-result retention.
**Retry policy:** Cancellation retry once per child after bounded backoff.
**Stop conditions:** Active tree contained or grace expires.
**Failure path:** Operator escalation; do not raise limits automatically.
**Verification:** No new spawn after freeze timestamp and active count no longer grows.
**Definition of Done:** Budget growth stopped, artifacts preserved, or blocking orphan incident declared.

## Workflow 4 — Release Regression Gate
**Trigger:** Orchestration/spawn/runtime changes.
**Goal:** Prevent budget-contract regression.
**Inputs:** Policy, guard, tests, representative traces.
**Baseline:** Previous known-good test and metric results.
**Stages:** Static rule review → unit tests → concurrent reservation race → recursive fan-out fixture → exhaustion fixture → partial-result recovery → compare metrics.
**Responsible agent:** Independent Verification Agent.
**Tools:** Test runner and synthetic fixtures.
**Outputs:** Pass/fail report.
**Checkpoints:** Each invariant group.
**Metrics:** Max admitted descendants/depth/concurrency, denial correctness, accounting consistency.
**Retry policy:** Maximum two implementation-fix cycles; verifier reruns independently.
**Stop conditions:** All required checks pass or two fix cycles exhausted.
**Failure path:** Block release.
**Verification:** Test evidence and no weakened policy.
**Definition of Done:** Hard invariants demonstrated with repeatable tests.