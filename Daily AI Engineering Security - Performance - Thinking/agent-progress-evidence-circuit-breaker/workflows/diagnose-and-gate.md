# Workflow: Diagnose and Gate Agent Progress

## Trigger
Automatic continuation request, repeated tool behavior, or suspected no-progress token burn.

## Goal
Continue productive work while deterministically stopping stale or looping execution.

## Inputs
Task state, ordered event ledger, artifact/test/evidence changes, policy.

## Baseline
Record current task state, progress counters, last tool-call hash, artifact digests, test status, and token usage when available.

## Context
Use observable state only. Hidden chain-of-thought is neither collected nor evaluated.

## Stages
1. **Observe** — snapshot authoritative task state and recent events.
2. **Measure baseline** — establish last known accepted progress event and counters.
3. **Diagnose** — distinguish productive iteration, stale scheduling, repeated call, or unchanged-result loop.
4. **Form hypothesis** — document one observable reason why another step may change state.
5. **Gate** — run `scripts/progress_guard.py` before continuation.
6. **Implement recovery** — only if permitted, change the action or precondition.
7. **Measure again** — require new accepted progress evidence.
8. **Verify** — independent verifier reviews completion or stop evidence.

## Responsible agent
Implementation/runtime agent performs stages 1–7. `subagents/progress-verifier.md` owns stage 8.

## Tools
Progress guard, repository diff/status, test runner, task-state API, token/tool telemetry.

## Outputs
Guard decision, evidence ledger, recovery outcome, verification status.

## Checkpoints
After baseline, before each continuation, after recovery, before completion.

## Metrics
No-progress windows, duplicate-call count, tokens/progress event, continuation-after-terminal-state count, false-stop rate.

## Retry policy
Maximum recovery attempts: policy value, default 2. Each retry MUST alter a hypothesis, action, or verified precondition.

## Stop conditions
Terminal task state; repeated-call threshold; no-progress threshold; exhausted recovery budget; missing authoritative task state.

## Failure path
Preserve evidence, stop scheduling, and escalate. Do not weaken safety, correctness, or verification to continue.

## Verification
Replay ledger through guard and independently check accepted progress artifacts/tests.

## Definition of Done
Baseline captured; root cause classified; bounded policy enforced; post-change metrics collected; independent verification complete; no unresolved blocking issue.
