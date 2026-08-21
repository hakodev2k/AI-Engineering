# Research — Tool Output Residual Recovery

## Topic
Durable residuals for truncated tool output across compaction and resume.

## Category
Thinking

## Problem
Long-running agents can lose exact evidence when a large tool result is truncated and the conversation later compacts. The model may then re-run work, infer that data is missing, or promote a partial observation into a confirmed conclusion even when the original result remains recoverable elsewhere.

## Why it matters now
Recent Codex reports in July–August 2026 describe the same failure class from different angles: recoverable tool state becoming invisible after compaction, incomplete residual metadata across capture/model/durable planes, repeated re-reads after compaction, and partial command output being summarized as completed state.

## Affected users
Developers running long coding/research agents; teams using large shell/MCP outputs; platforms persisting sessions across compaction/resume; workflows where exact test/log/query evidence matters.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #37121 (2026-08-05) reports a 26,790-token function output being truncated before compaction; the continuation then treated required data as missing even though full function-call state was still present in the persisted rollout.
2. Codex issue #35528 (2026-07-26) documents incomplete residual fidelity when output is capped/elided/batched/compacted: the system lacks a shared durable statement of what was produced, retained, omitted, and recoverable.
3. Codex issue #14206 requests spilling oversized tool outputs to an artifact with metadata and ranged retrieval rather than silently truncating the only model-visible copy.
4. Codex issue #16839 reports repeated post-compaction rereads, including a controlled case where a 610 KB file was reread 53 times.
5. Codex issue #35355 describes a related integrity risk: partial stdout from interrupted commands can be promoted into confirmed task state after compaction/resume.

### Interpretation
The recurring gap is a missing evidence contract between raw tool execution and compacted agent state. A summary is not sufficient when correctness depends on exact output. Agents need a deterministic residual that says what exists, what the inline preview contains, whether data was truncated, where the durable copy is, and whether the operation completed successfully.

### Proposed solution
Create a reusable residual layer that stores large tool output as a content-addressed artifact and emits a compact JSON residual containing content hash, byte/line counts, preview, truncation status, completion status, and artifact path. After compaction/resume, the agent validates the residual and selectively rereads only the needed ranges.

## Existing approaches
- Inline head/tail truncation.
- LLM-generated compaction summaries.
- Ad-hoc reruns or rereads.
- Persisted session logs without a first-class output residual.
- Manually redirecting command output to files.

## Remaining limitations
- Inline truncation may destroy structured JSON/XML validity.
- Summaries can omit exact values or completion state.
- Reruns may be expensive, non-idempotent, or impossible.
- Session logs are not necessarily indexed by recoverable output identity/range.
- A visible stdout fragment does not prove the command completed or its side effect persisted.

## Root causes
1. Tool output and evidence metadata are coupled to transient context.
2. Truncation is performed before a durable retrieval contract exists.
3. Compaction summarizes semantics but not exact recovery pointers.
4. Completion status and output content are often conflated.
5. Recovery defaults to re-derivation instead of bounded retrieval.

## Improvement opportunity
Persist exact output once, expose a small residual to the model, and make every later conclusion cite the residual status. Use deterministic hashes and ranged reads; use model reasoning only to decide which range/evidence is relevant.

## Metrics
- percentage of oversized outputs with durable residuals;
- bytes/tokens reread after compaction;
- repeated tool executions avoided;
- residual hash verification success rate;
- unsupported completion claims caught;
- recovery latency after compaction;
- exact-evidence availability rate.

## Relevant sources
- https://github.com/openai/codex/issues/37121
- https://github.com/openai/codex/issues/35528
- https://github.com/openai/codex/issues/14206
- https://github.com/openai/codex/issues/16839
- https://github.com/openai/codex/issues/35355

## Evidence status
**Implemented:** only after the package is integrated into a host/tool wrapper.

**Measured:** requires project traces before and after integration.

**Verified:** requires artifact integrity tests plus a truncate → compact/resume → recover scenario.