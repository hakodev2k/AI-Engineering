# Background Inference Quota Runaway Circuit Breaker

**Category:** Performance

## Problem
Background agent workers can continue invoking models while the visible task is idle, terminal, stale, or making no useful progress. August 2026 Codex reports include a memory worker that repeated the same completed turn 1,911 times over more than five hours, wait/status orchestration that re-metered a large cached context every 10–30 seconds, and memory jobs that retried oversized transcripts while idle.

## Evidence
See `evidence/research.md` for current sources and limitations of existing retry/backoff behavior.

## Existing approach and limitation
Timeouts, exponential backoff, generic retry limits, process cancellation, and user-visible stop controls exist, but they often operate at the wrong layer. A successful model response can still be semantically useless, and a background worker may not be linked to visible parent activity. Backoff slows a runaway loop without proving progress.

## Proposed improvement
Use a worker-level circuit breaker that correlates worker/turn identity, pending-input/follow-up flags, progress fingerprints, request count, and elapsed no-progress time. Terminal-without-input and repeated same-turn/no-progress conditions fail closed before further model calls.

## Package tree
- `evidence/research.md`
- `skills/diagnose-background-inference-runaway.md`
- `rules/background-inference-budget-rules.md`
- `subagents/runaway-verifier.md`
- `workflows/measure-contain-verify.md`
- `hooks/pre-background-model-call.md`
- `scripts/inference_loop_guard.py`
- `tests/test_inference_loop_guard.py`
- `config/policy.example.json`

## Installation
Python 3.9+; no third-party dependencies.

## Usage
Feed sanitized JSONL request-state events to `python scripts/inference_loop_guard.py events.jsonl`. Exit 0=within policy, 1=invalid input, 2=runaway condition detected.

## Metrics
Background model calls/task, idle model calls/task, same-turn repetitions, no-progress duration, tokens consumed after terminal state, quota consumed by background features, and mean time to circuit break.

## Verification
Run `python tests/test_inference_loop_guard.py`. Production verification requires before/after traces showing reduced redundant calls without interrupting legitimate long-running work.

## Safety
The guard does not kill arbitrary processes or mutate user data. A block stops new model-call authorization for the offending worker and hands control to recovery/escalation logic.

## Failure handling
On detector failure, fail closed for quota-consuming autonomous retries when state is ambiguous; preserve diagnostics. Maximum automated recovery attempts: 2.

## Definition of Done
Implemented: call admission uses the guard. Measured: baseline and after metrics exist. Verified: tests pass, a known runaway trace is blocked, legitimate progress trace passes, and no required work is silently abandoned.
