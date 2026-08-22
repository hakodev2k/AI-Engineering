# Repository Watcher Scope Budget Guard

**Category:** Performance

## Problem
Recursive repository watchers can consume nearly all available Linux `inotify` watches when they include dependencies, caches, generated files, Git internals, submodules, or duplicate watchers for the same repository. This can break unrelated developer tools and increase background event/CPU overhead.

## Evidence
See `evidence/research.md`. Current public signals include OpenAI Codex #39473 (65,082 watches against a 65,536 limit, with high-noise directories watched), plus related watcher-pressure reports on other Codex surfaces.

## Existing approach and limitations
Raising `fs.inotify.max_user_watches`, restarting the app, and generic ignore files can restore capacity temporarily but do not prove that watcher scope is justified or that duplicate watchers are avoided.

## Proposed improvement
Treat filesystem watches as a budgeted platform resource. Measure before changing anything, classify watched paths, exclude high-noise trees by default with explicit allow overrides, reuse watchers by canonical repository identity, and verify source/config change detection after optimization.

## Architecture
- `skills/profile-watcher-budget.md` — evidence-driven baseline and diagnosis procedure.
- `rules/watcher-budget-rules.md` — observable performance/correctness invariants.
- `subagents/watcher-verifier.md` — independent verification role.
- `workflows/measure-optimize-verify.md` — bounded optimization loop.
- `hooks/pre-watcher-budget-check.md` — deterministic pre-creation guard.
- `scripts/watcher_budget.py` — standalone watched-path budget profiler.
- `tests/test_watcher_budget.py` — boundary and classification tests.
- `evidence/research.md` — current evidence and interpretation.

## Package tree
```text
repository-watcher-scope-budget-guard/
├── README.md
├── evidence/research.md
├── hooks/pre-watcher-budget-check.md
├── rules/watcher-budget-rules.md
├── scripts/watcher_budget.py
├── skills/profile-watcher-budget.md
├── subagents/watcher-verifier.md
├── tests/test_watcher_budget.py
└── workflows/measure-optimize-verify.md
```

## Installation
Requires Python 3.9+ for the profiler. No third-party Python packages are required. Integrate the hook contract into the watcher creation path of your agent/runtime.

## Usage
Create a UTF-8 file with one watched path per line, then run:

`python scripts/watcher_budget.py --paths watched-paths.txt --limit 65536`

Exit codes: `0` safe, `1` warning threshold reached, `3` block-new threshold reached, `2` invalid input/runtime error.

## Workflow
Measure → classify dominant subtrees → diagnose duplicate/scope waste → form one hypothesis → implement a reversible exclusion/reuse change → measure again → run meaningful-change tests → independent verification.

## Metrics
Watch count, utilization, watcher instances/repo, watcher starts/hour, high-noise fraction, `ENOSPC`, event/CPU rate, and meaningful-change detection recall.

## Verification
A performance claim is valid only when before/after measurement shows lower watcher pressure and representative required-path changes are still detected. Raising the OS limit alone is not verification.

## Safety
Do not exclude paths required for source correctness, security monitoring, builds, tests, or generated-code inputs. Use explicit allow overrides. Do not change kernel limits automatically.

## Failure handling
Maximum two scope-optimization attempts. Restore previous scope on correctness regression. Escalate if pressure cannot be reduced without missing required events.

## Definition of Done
Evidence documented; baseline captured; dominant scope identified; optimization implemented; after metrics collected; no `ENOSPC`; required change-detection tests pass; independent verifier returns `verified`; rollback and residual risks are documented.

## Status
**Implemented:** package artifacts and deterministic profiler/tests.

**Measured:** environment-specific; requires running against a real watcher inventory.

**Verified:** environment-specific; requires passing before/after resource and change-detection validation.

## Customization
Adjust warning/block thresholds to preserve a measured reserve for other tools. Extend `NOISE_SEGMENTS` only with directories proven low-value in your environment, and maintain allow overrides outside the script for project-specific requirements.
