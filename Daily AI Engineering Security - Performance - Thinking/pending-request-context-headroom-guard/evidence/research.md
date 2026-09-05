# Research Evidence

## Topic
Pending Request Context Headroom Guard

## Category
Token

## Problem
Agent compaction decisions can be based on the *previous completed request* instead of the full *next pending request*. A large paste, file attachment, tool result, or newly retrieved context can therefore push the next model call beyond its context window before auto-compaction runs.

## Why it matters now
This is a current failure mode across active agent products. Zed issue #62423, opened 2026-08-10, reports auto-compaction checking only previous request usage and then sending a large pending prompt that exceeds the model window. Goose issue #11099, also opened 2026-08-10, reports auto-compaction not firing between agent turns, allowing long-running tasks to exceed configured thresholds. Letta issue #3288 documents a related context-overflow death spiral where tokenizer mismatch underestimates actual context and retries add more history.

## Affected users
Coding-agent users, IDE-agent developers, orchestration/platform teams, RAG systems that append large retrieved blocks, and long-running agents that ingest large tool outputs or files.

## Current public evidence

### Observed evidence
1. Zed #62423: auto-compaction evaluates prior usage rather than estimating the complete pending request, so a large new prompt can overflow the context window. The report includes a concrete reproduction with Zed 1.14.2 and a 90% auto-compact threshold.
2. Goose #11099: during autonomous multi-turn work, context may cross configured thresholds because auto-compaction is not triggered between turns; the issue requests compaction between agent turns.
3. Letta #3288: a self-hosted agent exceeded the model's true context window because token estimation underreported Qwen usage; retry artifacts accumulated, producing repeated LLM failures until manual intervention.

### Interpretation
Threshold-based compaction is incomplete when the trigger uses stale usage, ignores pending additions, or trusts a tokenizer/model-capacity estimate without safety margin. The important invariant is not `previous_usage < threshold`; it is `estimated_next_request + reserved_output + uncertainty_margin <= effective_context_window`.

### Proposed solution
Introduce a deterministic pre-send guard that calculates projected context from current history plus pending prompt/tool/retrieval additions, reserves output and uncertainty headroom, and returns one of three observable decisions: SEND, COMPACT, or BLOCK. Validate the guard with boundary tests and before/after metrics rather than relying on UI percentages.

## Existing approaches
Percentage-based auto-compaction; manual `/compact` or `/compress`; sliding-window eviction; model metadata context limits; provider token counters; summarization; hard context-window errors followed by retry.

## Remaining limitations
Percentage thresholds can use stale state; pending additions may not be included; provider/model tokenizers can differ; model metadata can be wrong or overridden by gateways; retrying an over-limit request can make history larger; generic summarization may discard required context.

## Root-cause analysis
- Compaction trigger runs after a completed turn instead of immediately before the next model request.
- Token accounting treats pending prompt/tool payloads separately from current history.
- Capacity calculations omit output reserve and tokenizer/model uncertainty.
- Retry paths do not distinguish context overflow from transient provider failures.
- Context correctness is inferred from configuration rather than measured projected request size.

## Improvement opportunity
Make context admission a pre-send gate with explicit projection, headroom, reason codes, and deterministic tests. Preserve required instructions, user constraints, security boundaries, and task-critical evidence during compaction; if the projected request still cannot fit, block and require a deliberate context-reduction path instead of blind retries.

## Relevant sources
- https://github.com/zed-industries/zed/issues/62423
- https://github.com/aaif-goose/goose/issues/11099
- https://github.com/letta-ai/letta/issues/3288
- https://github.com/NousResearch/hermes-agent/issues/66501
