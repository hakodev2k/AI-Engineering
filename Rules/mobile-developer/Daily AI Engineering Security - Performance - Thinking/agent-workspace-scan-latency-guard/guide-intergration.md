# Integration Guide

## Purpose
Integrate a bounded workspace-scan performance guard into AI coding-agent workflows without weakening sandboxing, approvals, or repository correctness.

## 1. Prerequisites
- Python 3.10+.
- Git for Git-specific probes.
- A repository/workspace that can be measured read-only.
- Optional OS tracing tools when Git measurements do not explain the delay.

No third-party Python packages are required.

## 2. Copy package files
Keep these paths together:
- `config/scan-budget.json`
- `scripts/measure_workspace_scan.py`
- `scripts/git_scan_guard.py`
- `tests/test_git_scan_guard.py`

Recommended project integration path is a non-production tooling folder, or keep this package external and point hooks at it.

## 3. Establish the first baseline
From the repository root:

```bash
mkdir -p .agent-metrics
python scripts/measure_workspace_scan.py . \
  --timeout 10 \
  --max-entries 50000 \
  --output .agent-metrics/baseline.json
```

Interpret the output fields:
- `git_status.elapsed_ms`: Git state without untracked enumeration.
- `git_status_untracked.elapsed_ms`: normal Git state including untracked discovery.
- `bounded_walk.elapsed_ms`: bounded/pruned filesystem traversal cost.
- `bounded_walk.bounded`: true means the maximum-entry guard was hit.
- `cross_fs_risk`: workspace is under `/mnt/*`; in WSL-like setups this deserves investigation.

### Diagnostic comparison
If normal Git status is much slower than `-uno`, investigate generated/untracked content first. Do not permanently disable untracked visibility until you prove it is safe for the workflow.

If both Git probes are fast but the agent remains slow, measure hidden agent/runtime overhead such as sandbox initialization, plugin/cache scanning, and concurrent repeated processes.

## 4. Enforce the budget

```bash
python scripts/git_scan_guard.py .agent-metrics/baseline.json \
  --policy config/scan-budget.json
```

Exit codes:
- `0`: pass.
- `2`: invalid input/policy.
- `3`: budget, timeout, or regression failure.

Tune `config/scan-budget.json` using evidence from your repository. The defaults are guardrails, not universal performance SLOs.

## 5. Compare after changes

```bash
python scripts/measure_workspace_scan.py . --output .agent-metrics/after.json
python scripts/git_scan_guard.py .agent-metrics/after.json \
  --policy config/scan-budget.json \
  --baseline .agent-metrics/baseline.json
```

Do not change the baseline and threshold in the same step merely to make a regression pass.

## 6. Safe mitigation patterns

### 6.1 Heavy untracked/generated directories
Verify the path first:

```bash
git status --porcelain=v1
git check-ignore -v path/to/generated/file
```

If a directory is local/generated and should not be tracked, consider `.git/info/exclude` for local-only exclusions or `.gitignore` when it is a repository-wide rule. Re-measure immediately.

### 6.2 Git caching
For large worktrees, Git documentation recommends evaluating:

```bash
git config core.untrackedCache true
git config core.fsmonitor true
```

Treat configuration changes as environment-specific. Test compatibility and measure before/after. Prefer repository/local config when suitable; require approval for global changes.

### 6.3 Background Git probes
Use:

```bash
git --no-optional-locks status --porcelain=v1
```

This reduces optional index-lock interaction for background status checks; it does not eliminate enumeration cost.

### 6.4 WSL cross-filesystem cost
For Linux-side tools in WSL, Microsoft recommends Linux filesystem storage for best performance. Prefer `/home/<user>/...` over `/mnt/c/...` for Linux-heavy build/scan workloads when practical.

Do not move repositories automatically. Moving a workspace can affect IDE paths, credentials, filesystem semantics, scripts, and tooling; require human approval.

### 6.5 Sandbox/plugin/runtime repeated scans
When repo/Git probes are fast but tool calls remain slow:
1. Record end-to-end tool latency.
2. Trace process/file activity for a bounded sample.
3. Separate repository paths from runtime cache/plugin/sandbox paths.
4. Count repeated initialization processes.
5. If building the runtime, implement cache/single-flight only with explicit invalidation and security-mode keys.
6. If using a third-party runtime, preserve trace evidence for an upstream issue.

Never switch to an unsafe/full-access sandbox mode solely to obtain better latency.

## 7. CI integration
A lightweight CI job can run the deterministic guard against synthetic measurements/tests. Real workspace latency measurements are often hardware-sensitive, so absolute timing checks are usually more meaningful on stable self-hosted runners than shared cloud runners.

Run functional tests:

```bash
python tests/test_git_scan_guard.py
```

On stable runners, add:

```bash
python scripts/measure_workspace_scan.py . --output workspace-scan.json
python scripts/git_scan_guard.py workspace-scan.json --policy config/scan-budget.json
```

Archive `workspace-scan.json` as a build artifact for trend analysis.

## 8. Agent integration pattern

```text
Agent task arrives
      ↓
Pre-task bounded scan measurement
      ↓
Within budget?
  ├─ Yes → run normal task
  └─ No  → bounded diagnosis
              ↓
         one reversible mitigation
              ↓
         identical re-measurement
              ↓
         independent verification
```

For long-running agents, do not rerun expensive probes before every tool call. Cache the guard result for a short, explicit validity window and invalidate on meaningful workspace/runtime changes.

## 9. Cache validity for agent runtimes
If implementing a platform-level optimization, include at least:
- canonical workspace identity;
- runtime version;
- sandbox/security mode;
- relevant configuration fingerprint;
- dependency/plugin manifest fingerprint when applicable;
- bounded expiry/invalidation;
- per-workspace single-flight for concurrent initialization.

Do not reuse security-sensitive initialization across incompatible modes or tenants.

## 10. Metrics to export
Recommended:
- `workspace_scan_git_status_ms`
- `workspace_scan_walk_ms`
- `agent_tool_end_to_end_ms`
- `agent_tool_command_ms`
- `agent_hidden_overhead_ms`
- `workspace_scan_timeout_total`
- `workspace_scan_regression_total`
- `runtime_scan_cache_hit_total`
- `runtime_scan_cache_miss_total`
- `runtime_scan_shared_waiters`

Derived metric:

```text
hidden_overhead_ms = end_to_end_tool_ms - actual_command_ms
```

Use it only when both durations are measured around comparable boundaries.

## 11. Rollback
Every mitigation record should specify:
- changed file/config;
- old value;
- new value;
- reason;
- baseline metric;
- post-change metric;
- rollback command.

If correctness, repository visibility, or security changes unexpectedly, rollback even if latency improves.

## 12. Recommended Definition of Done
- Baseline exists.
- Root cause is supported by measurements.
- Mitigation is reversible and scoped.
- Identical after-measurement exists.
- Guard passes without weakening thresholds.
- Required untracked/new files remain discoverable.
- Sandbox/security posture is preserved.
- Remaining limitations are documented.