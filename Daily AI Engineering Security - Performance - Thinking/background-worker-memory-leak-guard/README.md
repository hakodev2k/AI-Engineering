# Background Worker Memory Leak Guard

**Category:** Performance

## Problem
Long-running AI coding environments increasingly keep background agents, spare workers, app-server processes, and worker threads alive across tasks. Recent reports in both Claude Code and Codex show monotonic RSS growth, stale worker adoption, and runaway worker creation that can consume tens of GiB, trigger swap storms, OOM kills, or full-system freezes.

## Evidence
See `evidence/research.md`. The package is based on current August 2026 reports from Anthropic Claude Code and OpenAI Codex, including background workers that are never reaped, subagent processes reaching >20 GiB, and unbounded worker-thread creation.

## Existing approach and limitation
Product runtimes provide process supervisors, idle-worker pools, OS memory pressure handling, and crash recovery. These mechanisms do not consistently enforce per-worker lifetime/RSS budgets, distinguish active from stale descendants, or prove that memory returns toward baseline after work completes.

## Proposed improvement
Instrument the process tree around representative workloads, establish an idle and post-job baseline, detect monotonic retained RSS and stale descendants, and apply bounded containment actions only to verified orphan/stale workers. Active agents are never killed solely because memory is high; the default action is block/escalate with evidence.

## Package tree
- `evidence/research.md` — current signals, root causes, sources.
- `skills/memory-lifecycle-investigation.md` — evidence-driven investigation procedure.
- `rules/memory-lifecycle-rules.md` — enforceable baseline and containment rules.
- `subagents/memory-verifier.md` — independent verifier role.
- `workflows/measure-diagnose-contain.md` — bounded workflow.
- `hooks/post-job-memory-check.md` — deterministic post-job hook contract.
- `scripts/process_memory_guard.py` — portable process snapshot/analyzer.
- `tests/test_process_memory_guard.py` — deterministic regression tests.

## Installation
Requires Python 3.10+ and standard OS commands. No third-party Python package is required. Linux uses `/proc`; macOS/other Unix systems use `ps` fallback.

## Usage
Capture an idle baseline:

`python3 scripts/process_memory_guard.py snapshot --match 'claude|codex' --out baseline.json`

After a representative background workload and cooldown:

`python3 scripts/process_memory_guard.py compare --baseline baseline.json --match 'claude|codex' --cooldown-seconds 120 --max-growth-mb 512 --max-stale 2`

Exit `0` means within policy; exit `2` means a regression; exit `1` means invalid input/runtime failure.

## Metrics
Track tree RSS, worker count, stale-worker count, post-job retained RSS, RSS slope, time-to-baseline, swap pressure where available, and OOM/restart incidence. A performance improvement is not claimed without before/after measurement.

## Verification
Run `python3 -m unittest tests/test_process_memory_guard.py`. For a real runtime, run at least three baseline/workload/cooldown cycles. **Implemented** means instrumentation and policy exist. **Measured** means before/after artifacts are captured. **Verified** means tests pass and the post-job result stays within configured limits without terminating active work.

## Safety
The reference script is read-only: it never sends signals, kills processes, edits files, or changes system settings. Automated termination requires a separate human-approved host integration that proves a process is stale/orphaned.

## Failure handling
If process metadata is incomplete, the run fails closed for verification and preserves evidence. Retry collection at most twice. If memory remains above threshold, stop optimization attempts and escalate with snapshots rather than weakening the threshold or killing active workers.

## Definition of Done
Evidence documented; idle baseline captured; representative workload measured; root cause hypothesis recorded; post-job metrics collected; regression tests pass; no active worker is misclassified as stale; before/after comparison is complete; and independent verification records no blocking issue.

## Customization
Tune match expressions, cooldown, RSS growth budget, and stale-age thresholds to the host. Keep thresholds explicit and version-controlled.