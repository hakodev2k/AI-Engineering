# Hooks

## Hook 1 — Pre-task telemetry validation

**Trigger:** Before a multi-agent task starts.

**Action:** Verify the host can emit or derive task ID, agent ID, parent ID, role, and available token classes. Load `config/budgets.json` and reject invalid policy syntax.

**Command:** `python scripts/analyze_usage.py <empty-or-smoke-fixture.jsonl> --policy config/budgets.json`

**Expected result:** Valid config and a machine-readable pass report.

**Failure behavior:** Stop budget-enforced mode if policy is invalid. Do not run with silently disabled enforcement.

---

## Hook 2 — Pre-spawn envelope check

**Trigger:** Immediately before creating any child agent.

**Action:** Resolve parent task, proposed role, existing child count, current parent-tree token total, and role consumption. Apply the effective policy ceiling.

**Command/script:** Integrate the same numeric limits defined in `config/budgets.json`; use the analyzer report as the canonical reconciliation format.

**Expected result:** `allow`, `block_optional`, or `escalate_mandatory` with numeric evidence.

**Failure behavior:** Missing required parent/role metadata fails closed. Mandatory security/approval work escalates rather than being skipped.

---

## Hook 3 — Post-child usage checkpoint

**Trigger:** On every child completion, cancellation, retry, compaction, or provider usage update.

**Action:** Append normalized counters to the task ledger and recompute remaining envelope. Preserve combined-only totals in `unknown_tokens`.

**Command:** `python scripts/analyze_usage.py telemetry.jsonl --policy config/budgets.json --report usage-report.json`

**Expected result:** Updated pass report or explicit violation.

**Failure behavior:** If the configured ceiling is exceeded, prevent additional optional child spawns. Do not terminate a process in a way that risks data corruption; use the host's supported cancellation semantics.

---

## Hook 4 — Idle/background consumption detector

**Trigger:** Periodic host checkpoint while no user-visible task progress occurs, or whenever background jobs execute.

**Action:** Compare role-level token deltas against completed child outcomes. Flag positive token growth without corresponding outcomes and identify the responsible role when attribution exists.

**Expected result:** No unexplained slope, or an incident record naming the parent/role/unattributed bucket.

**Failure behavior:** Freeze optional background fan-out when supported; escalate if the consuming role is mandatory or attribution is insufficient.

---

## Hook 5 — Pre-commit regression check

**Trigger:** A change modifies prompts, context loaders, orchestration, retry behavior, model routing, or agent fan-out.

**Action:** Run the representative workload fixture, analyze usage, run functional acceptance tests, and compare against the approved baseline.

**Command:**
`python scripts/analyze_usage.py candidate.jsonl --policy config/budgets.json --report candidate-report.json`

Then run project-specific acceptance tests and `python tests/test_analyzer.py` for this package.

**Expected result:** Budget report passes and task-quality gates pass.

**Failure behavior:** Block merge/release; do not loosen policy automatically.

---

## Hook 6 — Final verification

**Trigger:** Before declaring a token optimization complete.

**Action:** Verify evidence exists for baseline, candidate, policy, acceptance results, and independent review. Classify status separately:
- **Implemented:** instrumentation/gates are present.
- **Measured:** comparable usage metrics were collected.
- **Verified:** token improvement/boundedness and quality/security criteria both pass.

**Expected result:** `Verified` only when all three levels are satisfied.

**Failure behavior:** Report partial state accurately; never label an unmeasured optimization as verified.
