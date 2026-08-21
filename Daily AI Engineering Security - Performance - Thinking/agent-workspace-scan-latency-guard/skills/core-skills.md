# Core Skills

## Skill 1 — Establish Workspace-Scan Baseline

**Purpose:** quantify hidden workspace inspection cost before changing configuration.

**Trigger:** agent/tool latency is high, disk/CPU spikes occur around tool calls, Git state checks appear repeatedly, or a workspace contains large generated/untracked trees.

**Inputs:** workspace path, active OS/runtime, agent frontend, sandbox mode, representative tool call, current Git config.

**Preconditions:** read access to workspace; Git available when repository metrics are required.

**Required context:** whether the runtime is native Windows, WSL, Linux, macOS; whether the workspace crosses `/mnt/*`; known generated directories; whether concurrent agents are active.

**Tools:** `scripts/measure_workspace_scan.py`, `time`, Task Manager/Process Monitor or `strace` when deeper attribution is needed.

**Procedure:**
1. Run a representative tool operation and record end-to-end latency.
2. Run the bounded workspace measurement script.
3. Record `git status -uno` separately from normal `git status`.
4. Compare normal Git status with the no-untracked variant to isolate untracked enumeration cost.
5. Record bounded filesystem walk cost.
6. If WSL is used, record whether the project/runtime/cache paths live under `/mnt/*`.
7. Repeat 3–5 times when stable p50/p95 estimates are needed.
8. Save measurements as baseline artifacts.

**Decisions:**
- If normal Git status is slow but `-uno` is fast, investigate untracked/generated paths.
- If both Git probes are fast but tool calls remain slow, inspect sandbox/plugin/runtime pre-tool work.
- If `/mnt/*` dominates file operations, investigate cross-filesystem placement.
- If latency rises only with concurrency, investigate duplicated initialization/scanning.

**Constraints:** do not disable sandboxing or security controls to create an artificial “fast” baseline.

**Expected output:** baseline JSON plus a diagnosis hypothesis ranked by evidence.

**Metrics:** Git status ms, bounded walk ms, representative tool latency, CPU/disk utilization, repeated-process count when available.

**Verification:** rerun the same probes without configuration changes and confirm comparable results.

**Failure handling:** if a probe times out, record timeout as evidence rather than increasing timeout indefinitely.

**Stop conditions:** stop baseline collection after sufficient repeatability or when the configured hard budget is exceeded consistently.

---

## Skill 2 — Identify Expensive Workspace Surfaces

**Purpose:** find which repository/cache/generated surfaces are responsible for repeated metadata work.

**Trigger:** baseline exceeds budget.

**Inputs:** baseline JSON, Git status output, workspace tree summary, optional process/syscall trace.

**Procedure:**
1. Compare tracked-only and untracked-inclusive Git status timings.
2. Inspect top-level untracked/generated directory candidates without recursively reading their contents first.
3. Use `.gitignore`, `.git/info/exclude`, and `git check-ignore -v` to verify intended ignore behavior.
4. For WSL, compare Linux-native paths with `/mnt/*` paths.
5. If agent runtime caches/plugins are implicated, profile their filesystem calls separately from repo calls.
6. For concurrent tasks, count repeated Git/sandbox/plugin setup processes.
7. Rank surfaces by estimated time, frequency, and bytes/entries touched.

**Expected output:** ordered hotspot table with path/surface, evidence, estimated cost, scan frequency, and safe mitigation options.

**Metrics:** percentage of scan time attributable to each surface; entry count; repeated scans per minute; filesystem boundary.

**Verification:** removing one hotspot from the measured path should produce a measurable delta.

**Stop conditions:** stop after the top contributors explain enough of the measured overhead to define an actionable hypothesis.

---

## Skill 3 — Apply Safe Scan-Cost Mitigation

**Purpose:** reduce workspace-scan cost without weakening security or hiding required repository state.

**Trigger:** a hotspot has evidence and a reversible mitigation exists.

**Procedure:**
1. Prefer repository-local or user-local ignore/exclude rules for generated artifacts that should never be tracked.
2. Evaluate `core.untrackedCache=true` and `core.fsmonitor=true` where supported and appropriate.
3. Use `--no-optional-locks` for background status probes.
4. Keep Linux workloads/files in the Linux filesystem when WSL cross-filesystem scans are implicated.
5. Cache expensive agent initialization only when invalidation inputs are known.
6. Deduplicate concurrent scan/setup work using per-workspace coordination when implementing an agent runtime.
7. Never change to full-access/unsafe sandbox mode solely for performance.
8. Re-run baseline with identical probes.

**Expected output:** change record with before/after metrics and rollback instructions.

**Verification:** improvement must exceed both noise and configured regression threshold; correctness checks must still detect changed/new files required by the workflow.

**Failure handling:** if latency does not improve, revert the change and test the next ranked hypothesis.

**Stop conditions:** maximum three mitigation hypotheses per investigation before re-baselining the root cause.

---

## Skill 4 — Enforce Workspace Scan Budget

**Purpose:** prevent regressions from becoming invisible agent latency.

**Trigger:** pre-task hook, CI performance check, agent startup, or runtime upgrade.

**Inputs:** current measurement, baseline, `config/scan-budget.json`.

**Procedure:**
1. Generate bounded measurement JSON.
2. Run `scripts/git_scan_guard.py` against policy.
3. When baseline exists, compare regression percentage.
4. Treat timeout or hard budget breach as failure.
5. Emit recommendations without automatically changing Git or sandbox configuration.
6. Store measurement for trend analysis.

**Expected output:** deterministic pass/fail with metrics, warnings, and safe recommendations.

**Metrics:** pass rate, regressions detected, timeouts, p95 Git status, p95 bounded walk.

**Verification:** `tests/test_git_scan_guard.py` passes and synthetic slow/timeout cases fail as expected.

**Stop conditions:** guard execution itself must remain bounded by configured probe timeout and entry limit.