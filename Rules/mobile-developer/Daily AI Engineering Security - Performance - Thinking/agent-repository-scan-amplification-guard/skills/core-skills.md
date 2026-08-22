# Core Skills

## Skill 1 — Scan Baseline and Attribution

**Purpose:** Establish whether repository discovery is a material performance bottleneck before changing behavior.

**Trigger:** Agent host, IDE extension, sandbox, or orchestration layer shows unexplained CPU/disk usage, repeated filesystem processes, or slow tool startup.

**Inputs:** repository/worktree identity, scan-event logs, host process telemetry, representative tasks, policy.

**Preconditions:** The team can distinguish repository-scan overhead from actual tool execution time.

**Required context:** Active worktree, repository size, large generated/dependency paths, active vs inactive projects, relevant host lifecycle events.

**Tools:** process monitor, host logs, Git/ripgrep command traces, `scripts/scan_guard.py`.

**Procedure:**
1. Record a baseline over at least one representative task and one idle window.
2. Emit one scan event per filesystem-discovery operation with timestamp, repo, worktree, scope, reason, scanner, elapsed time, concurrency, and observed paths.
3. Separate pre-tool scan duration from command/tool duration.
4. Run the guard and capture duplicate ratio, total scan time, maximum concurrency, and violations.
5. Rank scan sources by accumulated wall time and frequency.
6. Select one dominant amplification source; do not optimize unrelated scans in the same experiment.
7. Preserve the baseline report for before/after comparison.

**Decisions:** If scan overhead is below the team's materiality threshold, stop. If repeated scans are equivalent and filesystem state has not materially changed, prioritize deduplication. If scans enter irrelevant large trees, prioritize scope reduction. If overhead originates in sandbox setup, optimize sandbox invalidation separately from model tool logic.

**Constraints:** Do not disable correctness-critical discovery without a replacement invalidation mechanism. Do not infer scan cost from tool latency alone.

**Expected output:** baseline metrics, dominant scan source, scoped hypothesis, experiment plan.

**Metrics:** scans/task, duplicate ratio, total scan milliseconds, p50/p95 scan latency, concurrent scanners.

**Verification:** Baseline must be reproducible on the same fixture/task at least twice within reasonable variance.

**Failure handling:** If attribution is ambiguous, add host-level timestamps around lifecycle phases and repeat once. Maximum diagnostic retries: 2.

**Stop conditions:** Stop when scan overhead is immaterial, evidence is insufficient after 2 retries, or the root cause belongs to an upstream component outside the integration boundary.

## Skill 2 — Scope and Deduplication Optimization

**Purpose:** Reduce unnecessary tree walks without hiding required files.

**Trigger:** Baseline shows high duplicate-equivalent scans or traversal of irrelevant dependency/generated roots.

**Inputs:** baseline report, scan policy, filesystem-change signals, required discovery semantics.

**Preconditions:** A reliable scan identity and invalidation signal exist or can be added.

**Required context:** Which events actually require a fresh inventory: checkout, worktree creation, file create/delete/rename, ignore-rule changes, sparse-checkout changes.

**Tools:** scan cache/deduper in host, filesystem watcher, `scan_guard.py`.

**Procedure:**
1. Define scan identity as `(repo, worktree, scope, reason, ignore-policy-version)`.
2. Add a bounded cooldown only for equivalent identities.
3. Invalidate on explicit material filesystem/repository events rather than generic UI/session activity.
4. Narrow full-root scans to task-relevant scopes when correctness permits.
5. Exclude policy-denied dependency/generated paths from bookkeeping scans unless explicitly required.
6. Enforce concurrency and scans/minute budgets.
7. Re-run identical benchmark tasks.
8. Compare latency and correctness metrics.

**Decisions:** A cache hit is allowed only if no invalidating event occurred. A full scan requires an approved reason. Any discovered correctness regression invalidates the optimization.

**Constraints:** Never permanently cache repository state. Never silently omit task-relevant new files. Never use time-only caching where file correctness matters without an invalidation path.

**Expected output:** changed scan policy/host behavior plus before/after report.

**Metrics:** duplicate reduction, scan-time reduction, tool-latency reduction, file-discovery precision/recall on fixture set.

**Verification:** Representative file-add/delete/rename/checkout fixtures must still be detected.

**Failure handling:** Roll back the most recent scope/dedup change and isolate the missed invalidation signal. Maximum optimization iterations: 3.

**Stop conditions:** Target achieved, correctness regression persists after 3 iterations, or further optimization requires upstream changes.

## Skill 3 — Regression Gate

**Purpose:** Prevent future host changes from reintroducing scan amplification.

**Trigger:** CI, extension release, sandbox policy change, worktree implementation change, new project-indexing feature.

**Inputs:** recorded or synthetic JSONL scan traces, policy, baseline thresholds.

**Procedure:**
1. Execute representative scenarios: idle saved repo, active small edit, worktree creation, dependency-heavy workspace, checkout refresh.
2. Record scan events.
3. Run `python scripts/scan_guard.py --events <trace> --policy config/scan-policy.json --report scan-report.json`.
4. Fail CI on duplicate/rate/concurrency/denied-path/block-latency violations.
5. Compare aggregate scan time with the approved baseline.
6. Require explicit review for threshold changes.

**Expected output:** deterministic pass/block verdict and metrics artifact.

**Verification:** Intentionally amplified fixtures must fail; normal fixtures must pass.

**Failure handling:** Do not raise budgets automatically. Identify the event/source responsible and either fix it or approve a documented policy exception.

**Stop conditions:** CI pass with no correctness regression, or escalation with evidence.