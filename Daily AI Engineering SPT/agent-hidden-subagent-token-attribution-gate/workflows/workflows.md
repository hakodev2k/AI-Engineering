# Workflows

## Workflow 1 — Baseline → Attribute → Budget → Verify

**Trigger:** New multi-agent workflow, unexplained quota growth, or token-cost regression.

**Goal:** Establish a reproducible parent/child usage baseline and enforce bounded child-agent consumption without reducing required quality/security checks.

**Inputs:** Raw usage JSON/JSONL, task outcome criteria, current orchestration config, `config/budgets.json`.

**Baseline:** Run a representative bounded workload before optimization. Capture parent-tree total tokens, child tokens, child count, unknown ratio, role totals, tokens/completed child outcome, and acceptance-test result.

**Context:** Identify mandatory versus optional child roles and any background/platform-created roles.

**Stages:**
1. **Observe** — Telemetry Analyst gathers read-only usage events.
2. **Normalize** — Run `scripts/analyze_usage.py`; preserve combined-only usage as unknown.
3. **Reconcile checkpoint** — Confirm totals and attribution quality. If unknown ratio is too high, stop precise cost claims and improve instrumentation.
4. **Diagnose** — Rank roles by total child usage and tokens per completed outcome.
5. **Hypothesis** — Select exactly one cause to test: excessive context inheritance, excessive fan-out, repeated retries/compactions, or hidden background work.
6. **Budget** — Token Budget Engineer proposes parent-tree, per-child, per-role, and child-count ceilings.
7. **Implement** — Add deterministic pre-spawn and post-usage checks.
8. **Measure again** — Repeat the same workload.
9. **Independent verification** — Verify acceptance criteria, mandatory reviews, token metrics, and failure paths.

**Responsible agents:** Telemetry Analyst → Token Budget Engineer → Implementation Agent → Independent Verification Agent.

**Tools:** analyzer script, policy JSON, provider telemetry, test runner.

**Outputs:** Before/after reports, policy diff, implementation evidence, verification result.

**Checkpoints:** Attribution quality before optimization; policy test before deployment; mandatory-review coverage after deployment.

**Metrics:** Parent-tree tokens, child token share, unknown ratio, child count, tokens/completed outcome, task pass rate, verification coverage.

**Retry policy:** Maximum two failed optimization hypotheses. A retry must change a measured condition. Do not repeatedly shrink budgets without new evidence.

**Stop conditions:** Verified target achieved; mandatory quality regression occurs; telemetry is insufficient; or two hypotheses fail.

**Failure path:** Roll back the budget/implementation change, preserve evidence, and escalate with the normalized report.

**Verification:** Improvement requires lower/bounded relevant token metrics plus equivalent or better acceptance and mandatory verification coverage.

**Definition of Done:** Baseline captured, attribution reconciled, budgets enforced, tests pass, before/after metrics exist, mandatory checks remain intact, independent verification passes.

---

## Workflow 2 — Pre-spawn budget gate

**Trigger:** Orchestrator is about to spawn a child agent.

**Goal:** Prevent optional fan-out from exceeding the parent-owned envelope.

**Inputs:** Parent task ID, proposed child role, current usage report/ledger, configured policy.

**Baseline:** Remaining parent-tree token envelope and existing child count.

**Stages:**
1. Resolve parent task and child role.
2. Reject spawn metadata that lacks required parent or role fields.
3. Read current parent-tree totals from deterministic telemetry.
4. Determine effective per-child and role ceilings.
5. If child count or parent envelope is already exhausted: block optional child.
6. If the child is mandatory for security/approval/correctness: stop and escalate; do not bypass.
7. If budget remains: allow spawn and record the decision.

**Responsible agent:** Orchestrator/host code; no LLM required.

**Tools:** Policy config and usage ledger.

**Outputs:** Allow/block/escalate decision with numeric reason.

**Checkpoint:** Immediately before child creation.

**Retry policy:** No automatic retry for a budget rejection. A new attempt requires a changed policy approved by owner or released budget from completed/cancelled work.

**Stop conditions:** Decision emitted.

**Failure path:** Fail closed for mandatory metadata absence; do not silently spawn unattributed children.

**Verification:** Unit tests exercise under-budget, child-count breach, role breach, and mandatory-child escalation.

**Definition of Done:** Every child spawn has an auditable budget decision.

---

## Workflow 3 — Hidden/background quota incident

**Trigger:** Token/quota usage grows while user-visible progress is idle or disproportionate.

**Goal:** Determine whether hidden/background child work is the source and contain it safely.

**Inputs:** Time-ordered usage events, user activity timestamps, child lifecycle events, retry/compaction/background-job metadata.

**Baseline:** Normal idle usage and normal user-triggered workload usage.

**Stages:**
1. Freeze optional new fan-out if safe to do so.
2. Aggregate usage by parent, role, and time window.
3. Identify token growth with no completed child outcome.
4. Correlate growth with approval reviewers, memory jobs, retries, compactions, or background goals.
5. Apply a temporary bounded policy to the implicated optional role.
6. Reproduce in a safe test task.
7. Verify that quota growth stops and required behavior remains.

**Retry policy:** One reproduction retry if the first run is inconclusive. No endless incident reproduction.

**Stop conditions:** Source identified and bounded, evidence insufficient, or reproduction would risk excessive quota.

**Failure path:** Disable only optional background feature through supported configuration if available; otherwise stop the affected task and escalate. Never remove mandatory security gates.

**Verification:** Compare idle-window token slope and role totals before/after mitigation.

**Definition of Done:** Consumption source is attributed or explicitly unresolved, containment is applied safely, and follow-up evidence is recorded.

---

## Workflow 4 — CI token regression gate

**Trigger:** Change to prompts, context loading, agent fan-out, model routing, retries, or orchestration.

**Goal:** Detect material child-agent token regression before release.

**Inputs:** Stable workload fixture, baseline JSON report, candidate report, tolerance policy.

**Stages:**
1. Execute fixture on baseline and candidate under equivalent conditions.
2. Analyze both telemetry sets.
3. Compare parent-tree tokens, child share, unknown ratio, role totals, and tokens/completed outcome.
4. Run functional/quality acceptance tests.
5. Fail if configured token regression threshold is exceeded or quality/security coverage drops.

**Retry policy:** Maximum one rerun for a demonstrably noisy measurement. Record both runs.

**Stop conditions:** Gate passes/fails with evidence.

**Failure path:** Block merge/release and attach report; do not loosen threshold automatically.

**Verification:** Independent reviewer confirms comparison uses equivalent workload and no missing token classes are hidden by aggregation.

**Definition of Done:** Machine-readable pass/fail report and reproducible evidence exist.
