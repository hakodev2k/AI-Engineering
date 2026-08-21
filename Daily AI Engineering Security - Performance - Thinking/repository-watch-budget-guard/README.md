# Repository Watch Budget Guard

**Category:** Performance

## Problem
Agent-owned recursive file watchers can consume most or all Linux inotify capacity, causing `ENOSPC`, collateral failures in editors/desktop processes, and unnecessary CPU/memory pressure.

## Evidence
See `evidence/research.md`. Current Codex Desktop and VS Code extension reports independently show excessive watches, ignored exclusions, redundant scope, and system-wide exhaustion.

## Existing approach / limitations
Raising sysctl limits, editor excludes, reloads, feature switches, and relocating large trees can mitigate symptoms but do not create a measurable per-agent resource budget or guarantee release.

## Proposed improvement
Measure first; constrain scope; share watchers per canonical repository; preserve system headroom; fall back to bounded polling; verify teardown.

## Architecture
- `skills/watch-budget-baseline.md` — measurement and decisions.
- `rules/watcher-resource-rules.md` — enforceable resource policy.
- `subagents/watch-performance-investigator.md` — independent diagnosis/verification.
- `workflows/measure-diagnose-optimize.md` — bounded optimization loop.
- `hooks/pre-watcher-budget.md` — deterministic pre-start gate.
- `scripts/inotify_budget.py` — read-only profiler.
- `evidence/research.md` — public evidence and root causes.

## Installation
Python 3.9+ on Linux. No third-party package. The runtime must be able to read the target process `/proc/<pid>/fdinfo` and inotify sysctls.

## Configuration
Choose warning/block thresholds appropriate to a shared developer host. Defaults in the hook are 80% warning and 90% block. Production integrations should additionally budget estimated incremental watches before recursive registration.

## Usage
`python3 scripts/inotify_budget.py --pid "$PID" --warn 0.80 --block 0.90`

Exit codes: 0 PASS, 1 WARN, 2 invalid/unmeasurable, 3 BLOCK.

## Workflow
Observe → capture baseline → diagnose excessive scope/duplication/lifecycle → form a measurable hypothesis → change one cause → measure again → independently verify change detection and teardown. Maximum two remediation cycles.

## Metrics
Watch and instance utilization, target-process share, allocation delta, release ratio, watcher-start count, fallback rate, file-change detection success, ENOSPC count.

## Verification
Run the profiler before and after representative task startup; generate a controlled file change in watched scope; ensure it is detected; stop/detach the task; verify expected watch release. Do not claim improvement without before/after data.

## Safety
The package is read-only by default. It never raises kernel limits, kills processes, or removes arbitrary watchers. Capacity changes require explicit operator review.

## Failure handling
Detection: profiler status/log ENOSPC. Evidence: JSON metrics and watcher logs. Retry: two cause-changing cycles. Fallback: bounded polling or disable nonessential watcher behavior. Escalation: operator review. Stop if capacity remains unsafe or correctness regresses.

## Implemented / Measured / Verified
Implemented = guard integrated. Measured = comparable resource baselines captured. Verified = resource reduction plus change-detection and release tests pass independently.

## Definition of Done
Evidence documented; baseline captured; root cause identified; change implemented; before/after utilization improved or bounded; representative changes detected; expected watches released; no ENOSPC; independent verification passes; no blocking issue remains.

## Customization
Extend the profiler with same-UID aggregation, repository-root watch attribution, or platform adapters while preserving bounded thresholds and independent verification.