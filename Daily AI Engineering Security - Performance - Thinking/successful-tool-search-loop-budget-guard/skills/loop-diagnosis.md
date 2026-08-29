# Skill: Loop Diagnosis

## Purpose
Diagnose whether repeated tool discovery is productive exploration or a successful-but-stagnant loop.

## Trigger
Search/discovery calls exceed baseline, context grows rapidly, or completion latency crosses threshold.

## Inputs
JSONL trace; baseline metrics; task objective; required capabilities; configured budgets.

## Preconditions
Trace timestamps are sortable; tool calls expose names and arguments; results can be hashed without storing secrets.

## Required context
Task goal, available/discovered tools, discovery mechanism, baseline from comparable successful tasks.

## Allowed tools
Trace reader, JSON parser, hash function, metrics store, `scripts/tool_loop_guard.py`.

## Constraints
Do not inspect hidden chain-of-thought. Do not classify a call as progress merely because it returned success. Redact secrets before persisting evidence.

## Procedure
1. Capture baseline calls, search calls, latency, tokens, completion outcome.
2. Normalize each search into tool, canonical args, result fingerprint, new-tool IDs.
3. Mark progress only when the call adds a required capability, materially changes evidence, or completes a checkpoint.
4. Compute consecutive zero-progress searches and repeated fingerprints.
5. Separate transient failures from successful stagnation.
6. Form at most two hypotheses.
7. Test the highest-evidence hypothesis with one controlled change.
8. Re-measure on the same workload.

## Decision points
If required tools are absent, stop and return capability-unavailable. If the same result repeats beyond budget, block even when `ok=true`. If queries vary but no capability is added, apply the stagnation budget.

## Expected output
Baseline, loop classification, fingerprints, root-cause hypothesis, selected guard threshold, before/after metrics.

## Metrics
Search calls, stagnant streak, repeated fingerprints, new-tools/search, latency, tokens, completion/quality.

## Verification
An independent verifier reproduces the verdict and confirms the guarded run completes or fails explicitly within budget.

## Failure handling
If trace evidence is incomplete, use conservative count/time budgets and report limited confidence. Maximum diagnostic iterations: 2.

## Stop conditions
Stop after evidence supports a root cause and guarded rerun, or when observability cannot distinguish progress from stagnation.
