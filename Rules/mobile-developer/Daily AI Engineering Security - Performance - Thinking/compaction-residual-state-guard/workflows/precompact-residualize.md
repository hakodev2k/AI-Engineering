# Workflow: Pre-Compaction Residualization

## Trigger
Context utilization crosses threshold, tool output is truncated, or manual/automatic compaction is requested.

## Goal
Reduce active-context tokens while preserving all execution state required for correct continuation.

## Inputs
Active goal, tool/result inventory, persisted references, current context size, residual policy.

## Baseline
Record pre-compaction token/byte size, required-state count, repeated-tool-call count, and current task/verification status.

## Stages
1. **Observe** — Context Integrity Auditor inventories tool/result state.
2. **Measure baseline** — Record active context and required-state coverage.
3. **Diagnose** — Identify large/duplicate/evictable content and required state at risk.
4. **Form hypothesis** — Select state to retain inline vs reference without compromising correctness.
5. **Residualize** — Create manifest entries with IDs, hashes, sizes, recoverability, references, and continuation reason.
6. **Gate** — Run `scripts/residual_guard.py manifest.json --policy config/residual-policy.json --strict`.
7. **Compact** — Only when the gate allows it.
8. **Measure again** — Record post-compaction context size and token reduction.
9. **Recover/verify** — Recovery Verifier resolves required references and checks hashes/authorization scope.
10. **Complete** — Mark verified only if recovery passes and task quality is unchanged.

## Responsible agents
Context Integrity Auditor for stages 1–6; host compaction mechanism for 7; Recovery Verifier for 8–10.

## Tools
Session/rollout metadata, secure persistent storage, SHA-256, residual guard, token/context metrics.

## Outputs
Residual manifest, allow/block decision, before/after context metrics, recovery verification report.

## Checkpoints
Before truncation/compaction, immediately after compaction, and before relying on a recovered record.

## Metrics
Required residual coverage, context/token reduction, recovery success, repeated-work/tool calls, regression rate.

## Retry policy
At most 2 residual repair attempts. Never retry by silently dropping a required state item.

## Stop conditions
Verified compaction succeeds; required state is unrecoverable; authorization-safe recovery cannot be implemented; or retry budget is exhausted.

## Failure path
Keep state un-compacted when safe, report the blocking records, or begin a controlled new session with an explicit verified handoff. Do not pretend missing state was preserved.

## Definition of Done
Required-state coverage is 100%, context usage is measurably reduced, all sampled/required references recover with matching hashes, security boundaries are preserved, and no correctness regression is observed.
