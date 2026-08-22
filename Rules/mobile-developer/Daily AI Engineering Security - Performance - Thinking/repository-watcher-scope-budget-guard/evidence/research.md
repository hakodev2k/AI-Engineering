# Research — Repository Watcher Scope Budget Guard

## Topic
Repository watcher scope can exhaust OS file-watch budgets by observing dependencies, caches, generated files, and Git internals that do not need fine-grained monitoring.

## Category
Performance

## Problem
AI coding applications often start one or more repository watchers per task/session. On Linux, broad recursive watcher scope can consume most or all `inotify` watches. Once the process approaches `fs.inotify.max_user_watches`, unrelated IDEs and developer tools can no longer create watchers. The problem is especially expensive when the same repository is opened by several tasks and when `.venv`, `__pycache__`, `.git/objects`, submodule internals, and generated trees are watched.

## Why it matters now
A 2026-08-19 Codex Desktop report measured 65,082 watches owned by the main ChatGPT process against a system limit of 65,536, with 118 watcher starts in about 20 minutes. The watched set included `.venv`, `__pycache__`, `.git/objects`, `.git/modules`, and `.git/refs/codex/turn-diffs`. The report explicitly distinguishes this from a stale-empty-watcher process issue: the main process was watching roughly 65,000 actual files/folders.

## Affected users
Developers using AI coding desktop apps or extensions on Linux, teams running many repository tasks, monorepo users, Python/Node projects with large dependency trees, submodule-heavy repositories, and platform builders implementing filesystem-driven agent context refresh.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #39473, filed 2026-08-19, reports 65,082 watches vs a 65,536 limit and repeated `ENOSPC: System limit for number of file watchers reached`. The watcher covered `.venv`, caches, Git objects, Git modules, and turn-diff refs. It also observed 118 “Starting git repo watcher” events in ~20 minutes. Source: https://github.com/openai/codex/issues/39473
2. OpenAI Codex issue #23574 is cited by #39473 as an open VS Code extension report of the same general watcher-pressure class. This independent surface indicates the risk is not confined to one standalone Desktop process. Source: https://github.com/openai/codex/issues/23574
3. #39473 also references #39123 as a recent Fedora report involving many watcher objects held by helpers. Its mechanism differs, but it independently demonstrates file-watch resource pressure in current Codex workflows. Source: https://github.com/openai/codex/issues/39123

### Interpretation
The reusable engineering failure is not simply “Linux watch limits are too small.” It is the absence of a **watcher scope budget** and repository-level watcher reuse invariant. A watcher should be justified by semantic change value, not filesystem reachability. Increasing `max_user_watches` can mask the symptom while preserving unnecessary kernel resources and duplicate observation work.

### Proposed solution
Introduce a deterministic repository watcher budget layer that:
- profiles current watch count and OS limit before starting/reconfiguring a watcher;
- applies deny-by-default exclusions for dependency/cache/generated/Git-internal trees, with allow overrides;
- shares one watcher per canonical repository root when possible;
- treats watcher creation as a budgeted resource with warning and blocking thresholds;
- records start/stop/refcount events to detect churn;
- verifies that meaningful source/config changes are still detected after scope reduction.

## Existing approaches
- Raising `fs.inotify.max_user_watches`.
- Generic ignore lists such as `.gitignore`.
- Per-tool hard-coded watcher exclusions.
- Restarting the app to reclaim watchers.

## Remaining limitations
- `.gitignore` is not equivalent to a watcher policy: ignored files may still be semantically needed and Git-internal paths may not be ignored.
- Raising limits does not prevent duplicate watchers or unnecessary scope.
- Broad exclusions can miss generated artifacts that are genuine inputs; policy needs explicit allow overrides.
- Watcher sharing requires canonical repository identity and refcount lifecycle management.

## Root-cause analysis
1. Recursive filesystem watchers are cheap to start but expensive at repository scale.
2. Dependency/cache/Git-internal directories multiply watch count without proportional signal value.
3. Multiple tasks can instantiate duplicate watchers for the same repository.
4. Start/stop lifecycle is often not exposed as a metric.
5. Systems frequently react only after `ENOSPC`, when unrelated applications may already be impacted.

## Improvement opportunity
A portable preflight analyzer plus policy contract can keep watch utilization below a configured fraction of the OS limit, prevent high-noise directories from entering the set, and make watcher churn measurable. The package does not require kernel-level changes.

## Goal
Reduce watched objects and watcher startups while preserving detection of meaningful project changes.

## Metrics
- watch count before/after;
- utilization = process watches / OS watch limit;
- watched paths by top-level subtree;
- excluded high-noise path count;
- watcher instances per canonical repo;
- watcher starts/hour;
- `ENOSPC` failures;
- meaningful-change detection recall;
- CPU and event rate before/after.

## Trigger
Repository open, task creation, subagent spawn that requests filesystem monitoring, watcher restart, or utilization crossing warning threshold.

## Inputs
Repository root, current watch inventory or path list, OS watch limit, exclusion/allow policy, canonical repo ID, active watcher registry.

## Outputs
Baseline report, normalized exclusion plan, budget verdict (`safe`, `warn`, `block-new`), and verification results.

## Status
**Implemented:** profiler, rules, workflow, verifier instructions, hook contract, and tests.

**Measured:** only after running the profiler on an adopting environment.

**Verified:** only when watch count decreases, budget thresholds hold, and change-detection regression tests pass.
