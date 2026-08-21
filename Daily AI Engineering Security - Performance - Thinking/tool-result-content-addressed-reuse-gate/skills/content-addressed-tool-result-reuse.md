# Skill: Content-Addressed Tool Result Reuse

## Purpose
Reduce repeated model-visible tool-result tokens while preserving fresh observation and correctness.

## Trigger
Use when traces show the same successful read-only tool with the same normalized arguments returning unchanged medium/large output multiple times in one active context epoch.

## Inputs
Tool name, normalized arguments, explicit read-only annotation, success/error state, fresh output, context epoch, prior visibility record, token/byte telemetry, and `config/policy.json`.

## Preconditions
The tool has already executed. Read-only eligibility is explicit and trustworthy. The runtime can distinguish compaction/pruning/migration by changing a context epoch or equivalent visibility identifier.

## Required context
Current prompt construction, tool annotations, compaction lifecycle, message retention rules, provider token telemetry, and any result-normalization behavior.

## Allowed tools
Trace/log inspection, deterministic hashing, token estimators, `scripts/tool_result_reuse_gate.py`, tests, and benchmark replay with sanitized/synthetic tool results.

## Constraints
- MUST NOT skip tool execution merely because a previous result exists.
- MUST NOT elide side-effecting or unknown-effect tools.
- MUST NOT elide errors, even if byte-identical.
- MUST NOT emit a reuse marker unless the prior full payload is proven visible in the active context epoch.
- MUST invalidate visibility after compaction, pruning, migration, reset, or any event that may remove the referenced payload.
- MUST send changed output in full.
- MUST preserve correctness/context required for the task even when that reduces token savings.

## Procedure
1. Measure baseline repeated-result bytes/tokens, tool executions, compactions, and task quality.
2. Identify candidate tools with explicit read-only semantics.
3. Normalize arguments deterministically; do not guess equivalence between semantically different calls.
4. Execute the tool normally.
5. Hash `tool name + normalized arguments + fresh output`.
6. Compare with the prior identity for the same call signature.
7. Confirm the previous full payload is still visible in the current context epoch.
8. Confirm the result succeeded and the marker is materially smaller than the payload.
9. If all checks pass, emit a deterministic reuse marker; otherwise emit the full fresh result and refresh the visibility record.
10. On context epoch change, invalidate all visibility leases and reinject full results on their next fresh execution.
11. Attribute emitted/saved bytes or estimated tokens to the gate.
12. Re-run representative tasks and compare quality, tokens/task, latency/task, and compaction frequency.

## Decision points
- Non-read-only/unknown tool: full payload.
- Error result: full payload.
- Changed output/hash: full payload.
- Different context epoch: full payload.
- Prior full payload not provably visible: full payload.
- Marker not sufficiently smaller: full payload.
- Otherwise: reuse marker.

## Expected output
A deterministic full-payload or reuse-marker decision plus identity, byte savings, context epoch, and reasons.

## Metrics
Tokens/task, repeated-result bytes, emitted bytes, saved bytes, elision hit rate, reinjection after compaction, false-elision count, quality regression rate, compaction count, and latency/task.

## Verification
Replay identical, changed, error, side-effecting, and post-compaction fixtures. The number of underlying tool executions must not decrease solely because of reuse. Task outputs must remain equivalent under agreed quality checks.

## Failure handling
If quality regresses or the runtime cannot prove visibility, disable elision for the affected tool/path and emit full fresh results. Preserve telemetry for diagnosis. Maximum two optimization iterations before reverting to full payload behavior.

## Stop conditions
Stop optimization when token savings are below threshold, quality regression exceeds acceptance criteria, visibility cannot be proven, or any stale/misleading reference is observed.