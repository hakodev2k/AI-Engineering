# Research — Agent Workspace Scan Latency Guard

## Problem
AI coding agents frequently inspect Git state, repository trees, dependency folders, plugin caches, sandbox metadata, and filesystem state before or between tool calls. On large workspaces or cross-filesystem setups, repeated scans can dominate end-to-end latency even when the underlying command itself is fast.

## Category
Performance

## Why it matters now
Recent Codex issues from June–July 2026 show multiple independent cases where repeated workspace-related scanning caused severe latency or resource saturation:

1. **openai/codex #33737 — 2026-07-17, open**
   - Windows elevated sandbox repeatedly processed a pnpm workspace with 1,617 `.pnpm` directories.
   - Disk active time reached 100%.
   - Tool response latency was reported at 30–130 seconds while the underlying small read and `rg` operations were about 114 ms and 178 ms.
   - The reporter expected sandbox initialization to be cached or to avoid recursively processing large dependency trees on each invocation.

2. **openai/codex #35008 — 2026-07-23, open**
   - A repository contained tens of thousands of untracked files and more than 1 GB of local artifacts.
   - Repeated Git inspections drove CPU usage up to 100% and `git status` exceeded 24 seconds.
   - Adding the artifact directory to `.git/info/exclude` reduced `git status` to about 56 ms and stopped repeated Git/WMI/antivirus activity.

3. **openai/codex #26149 — 2026-06-03, open**
   - Codex Desktop with WSL repeatedly scanned plugin/cache data under `/mnt/c/.../.codex/.tmp/plugins`.
   - A 20-second `strace` sample recorded 17,481 file/process syscall lines; 7,426 (~42%) touched the plugin cache while only 569 (~3%) touched the actual repository.
   - The same project was fast when Codex CLI ran directly inside WSL.

These reports are not identical bugs, but they share an engineering failure mode: **unbounded or repeated metadata-heavy scans are performed without a measured budget, cache validity check, or workspace-cost guard**.

## Official technical guidance supporting the diagnosis

### Git status performance
Current Git documentation explicitly states that `git status` can be very slow in large worktrees when it searches for untracked files. Git documents several mitigations:
- `--untracked-files=no` when untracked enumeration is unnecessary;
- `core.untrackedCache=true`;
- `core.fsmonitor=true` together with the untracked cache;
- careful use of ignore/exclude rules.

Git also notes that background `git status` processes should consider `--no-optional-locks` to reduce lock conflicts.

### WSL filesystem placement
Microsoft's WSL guidance recommends keeping files in the Linux filesystem when using Linux command-line tools for best performance. Cross-filesystem access through `/mnt/c` is slower and should be avoided in tight build or scanning loops when possible.

## Existing approaches
- Add heavy generated directories to `.gitignore` or `.git/info/exclude`.
- Manually move repositories into the WSL/Linux filesystem.
- Disable or reduce untracked-file reporting in Git.
- Enable Git untracked cache and FSMonitor.
- Close concurrent agent tasks.
- Use a different agent frontend/CLI when one runtime has expensive workspace setup.
- Manually investigate with Task Manager, Process Monitor, `strace`, `time`, or Git tracing.

## Observed limitations of current approaches
- Most are reactive: developers diagnose the problem only after the agent becomes slow.
- Ignore rules solve known heavy paths but do not detect new generated/artifact directories.
- `git status -uno` is fast but can hide new files and is unsafe as a universal default.
- FSMonitor/untracked cache help Git but do not address sandbox ACL scans, plugin-cache scans, or other agent runtime scans.
- Moving files between Windows and WSL can help cross-filesystem overhead but does not stop redundant scans.
- Disabling a sandbox or using full-access modes can improve speed but weakens security and is therefore not an acceptable default optimization.
- Current workarounds rarely provide an objective scan budget or regression threshold.

## Root-cause hypotheses
1. Workspace inspection is treated as negligible fixed overhead rather than a measurable operation.
2. Repeated pre-tool initialization lacks cache reuse or cache invalidation boundaries.
3. Large generated/untracked directories are discovered recursively instead of being pruned early.
4. Concurrent agents repeat the same workspace metadata work independently.
5. Cross-filesystem paths amplify metadata-heavy scans.
6. Tool wrappers measure command duration but not hidden pre/post-tool overhead.
7. No deterministic guard blocks a task when scan overhead exceeds a configured latency or file-count budget.

## Improvement target
Create a reusable workspace-scan guard that:
- establishes a measurable baseline before optimization;
- measures Git status latency separately from filesystem enumeration latency;
- detects heavy untracked/generated directories without scanning known ignored trees deeply;
- detects Windows/WSL cross-filesystem risk;
- compares scan cost against explicit budgets;
- recommends safe mitigations before risky ones;
- never disables sandboxing automatically;
- records before/after metrics;
- can fail a pre-task hook when workspace scan overhead exceeds a hard threshold;
- supports CI or local regression checks.

## Success metrics
- `git status` p95 stays below configured threshold for the target workspace.
- workspace enumeration p95 stays below configured threshold.
- hidden/pre-tool scan overhead is measured separately from actual command latency when instrumentation is available.
- heavy untracked paths are identified with bounded traversal.
- no optimization requires disabling sandbox/security controls.
- regression checks detect >configured percentage or absolute latency increase.
- before/after measurements are stored for comparison.

## Sources
- OpenAI Codex issue #33737, opened 2026-07-17: https://github.com/openai/codex/issues/33737
- OpenAI Codex issue #35008, opened 2026-07-23: https://github.com/openai/codex/issues/35008
- OpenAI Codex issue #26149, opened 2026-06-03: https://github.com/openai/codex/issues/26149
- Git `git-status` documentation, including “UNTRACKED FILES AND PERFORMANCE”: https://git-scm.com/docs/git-status
- Git configuration documentation: https://git-scm.com/docs/git-config
- Microsoft WSL filesystem guidance: https://learn.microsoft.com/windows/wsl/filesystems
- Microsoft WSL interop guidance: https://learn.microsoft.com/windows/dev-environment/wsl-interop

## Evidence / interpretation / proposed solution boundary
- **Observed evidence:** the issue reports and official Git/WSL documentation above.
- **Interpretation:** repeated workspace metadata scans are a recurring performance class that should be treated as budgeted infrastructure work rather than invisible agent overhead.
- **Proposed engineering solution:** the guard, scripts, thresholds, hooks, and workflows in this package are a reusable design derived from the observed failure mode; they are not claimed to be an official Codex feature or standard.