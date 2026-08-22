# Core Skills

## Skill 1 — Build a subagent usage baseline

**Purpose:** Establish measurable token consumption before changing orchestration.

**Trigger:** A workflow uses child agents, hidden reviewers, background memory/research jobs, or shows unexplained quota growth.

**Inputs:** Raw JSON/JSONL usage telemetry; task IDs; agent IDs; parent IDs when available; agent role/feature; token classes; completion status.

**Preconditions:** Preserve raw telemetry read-only. Do not infer missing input/output splits from a combined total.

**Required context:** Which work is user-requested versus platform/background work; which child roles are mandatory for security/correctness; current quota/cost expectations.

**Tools:** `scripts/analyze_usage.py`, `config/budgets.json`, provider traces/logs.

**Procedure:**
1. Select a representative bounded workload and record task outcome criteria.
2. Export usage events without prompt contents when possible.
3. Normalize telemetry with `analyze_usage.py`.
4. Record parent-tree total, child token share, child count, unknown-token ratio, tokens per completed child, and role totals.
5. Repeat the workload at least three times if nondeterminism is material; compare median and worst case.
6. Mark every metric as **Measured**, **Estimated**, or **Unknown**. Combined child totals belong in `unknown_tokens`, not an invented split.
7. Save the baseline report before changing budgets or fan-out.

**Decisions:** If unknown-token ratio exceeds policy, improve telemetry before making precise cost claims. If one role dominates child usage, investigate that role before globally shrinking context.

**Constraints:** Never disable mandatory verification or approval solely to hit a token budget.

**Expected output:** A normalized baseline report and evidence-backed candidate bottleneck.

**Metrics:** Attributable token ratio, unknown-token ratio, child token share, tokens/completed outcome, cache ratios, child count.

**Verification:** Totals reconcile with the source telemetry within the known schema; no token class is double-counted.

**Failure handling:** If IDs are missing, classify events as unattributed and stop precise role-level optimization. If telemetry is malformed, fix collection rather than guessing.

**Stop conditions:** Baseline is reproducible enough for comparison, or measurement quality is insufficient and escalation is required.

---

## Skill 2 — Design a parent-owned token envelope

**Purpose:** Convert observed consumption into enforceable, task-owned limits.

**Trigger:** Baseline shows costly child fan-out, hidden background consumption, or a need for predictable quota use.

**Inputs:** Baseline report; required child roles; task criticality; quality acceptance criteria; available context limits.

**Preconditions:** Security/correctness requirements are identified before budget reduction.

**Required context:** Maximum acceptable child count, parent-tree token budget, per-role costs, expected number of useful child outcomes.

**Tools:** `config/budgets.json`; orchestrator pre-spawn/post-usage hooks.

**Procedure:**
1. Set a parent-tree ceiling from measured normal runs plus a documented tolerance.
2. Set child-count limits based on useful parallelism, not maximum available concurrency.
3. Define per-child ceilings for each role. Use tighter limits for simple guardians/classifiers and wider limits for evidence-heavy reviewers.
4. Define a maximum unknown-token ratio. Unknown usage must reduce confidence, not disappear from accounting.
5. Define child-token-share thresholds to detect parent workflows that become mostly orchestration overhead.
6. Attach every spawned child to a parent task and explicit role.
7. Before spawn, calculate remaining envelope. Refuse optional fan-out when insufficient.
8. For mandatory child work that cannot fit, stop/escalate or choose an approved bounded alternative.

**Decisions:** Optional children may be skipped after budget exhaustion; mandatory security/approval children require escalation, not bypass.

**Constraints:** No unlimited retry/refill. No silent context truncation that removes required evidence.

**Expected output:** Versioned budget policy and a documented enforcement point.

**Metrics:** Prevented spawns, budget breach rate, task success rate, verification coverage, token savings versus baseline.

**Verification:** Run policy against baseline and intentionally over-budget fixtures; expected pass/fail behavior must match.

**Failure handling:** If budget causes material quality regression, revert or raise the smallest affected role budget using evidence.

**Stop conditions:** Budgets are enforceable, tested, and preserve mandatory quality/security checks.

---

## Skill 3 — Diagnose hidden/background token amplification

**Purpose:** Find quota consumption not proportional to visible user progress.

**Trigger:** Usage grows while idle, approvals cost unexpectedly much, or child totals dominate parent work.

**Inputs:** Time-ordered usage events, lifecycle events, role/feature metadata, retry/compaction events, user activity timestamps.

**Preconditions:** Avoid collecting sensitive prompt text unless necessary; IDs and counters are usually sufficient.

**Procedure:**
1. Separate user-triggered, parent-triggered, and platform/background child work.
2. Group by role and parent task.
3. Detect repeated child creation with identical role and no new user-visible outcome.
4. Correlate token growth with retries, compactions, waits, approvals, or memory jobs.
5. Compute tokens per completed child outcome and child token share.
6. Form one bounded hypothesis at a time: excessive context inheritance, repeated retries, excessive fan-out, or hidden platform work.
7. Apply one change and remeasure the same workload.
8. Stop after two unsuccessful hypotheses and escalate with the collected report.

**Expected output:** Root-cause hypothesis with before/after evidence.

**Verification:** Improvement must show lower relevant token metrics with equivalent acceptance/verification coverage.

**Failure handling:** Do not claim savings from quota UI alone if local event totals do not reconcile.

**Stop conditions:** Cause is measured and mitigated, or two bounded experiments fail.

---

## Skill 4 — Verify token regressions without weakening quality

**Purpose:** Prevent optimization from trading correctness for cheaper runs.

**Trigger:** Any budget, routing, context, or fan-out change.

**Inputs:** Baseline workload, acceptance tests, verification requirements, before/after reports.

**Procedure:**
1. Run the same representative tasks before and after.
2. Compare parent-tree tokens, child tokens, unknown ratio, child count, latency if available, and tokens/completed outcome.
3. Run task-specific acceptance tests and mandatory reviewer/security checks.
4. Mark results separately as **Implemented**, **Measured**, and **Verified**.
5. Reject the change if token use falls but required verification coverage or task success regresses beyond the documented tolerance.

**Metrics:** Token reduction %, quality pass rate, verification coverage, rework rate.

**Stop conditions:** Improvement is both cheaper and acceptably equivalent/better in outcome quality, or the change is rolled back.
