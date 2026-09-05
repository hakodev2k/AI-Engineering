# Skill: Pending Context Budget Analysis

## Purpose
Prevent context-window overflow by evaluating the complete projected next request before a model call.

## Trigger
Before every model request when history, prompt, tool output, retrieval output, memory, or file context changed; also after compaction and before retrying a context-related failure.

## Inputs
Effective context window; current-history tokens; pending user/prompt tokens; pending tool/retrieval tokens; reserved output tokens; uncertainty margin; compaction threshold.

## Preconditions
Token measurements must use the provider tokenizer when available. Model capacity must come from authoritative runtime/model configuration. Unknown capacity blocks automatic admission.

## Required context
Current model/provider, active system and user constraints, protected context segments, pending additions, and any gateway-specific context limit.

## Allowed tools
Provider token counter, local tokenizer, repository/config readers, `scripts/pending_context_guard.py`, benchmark/replay fixtures.

## Constraints
Never remove security policy, user requirements, tool authorization constraints, unresolved decisions, or evidence required for correctness solely to reduce tokens.

## Procedure
1. Measure current history and every pending addition independently.
2. Resolve the effective context window and record the source of truth.
3. Reserve expected output tokens and an uncertainty margin.
4. Run the guard to compute projected utilization.
5. If SEND, record projected utilization and continue.
6. If COMPACT, compact only eligible context, recount, and rerun the guard.
7. If BLOCK, do not send the model call; reduce optional context or choose a larger compatible context window with explicit policy approval.
8. For prior overflow failures, do not blind-retry unchanged input.
9. Compare actual provider-reported usage with projected usage and calibrate the uncertainty margin.

## Decision points
- Projected tokens within admission limit: SEND.
- Projected tokens above admission limit but below hard capacity: COMPACT.
- Projected tokens plus reserves exceed hard capacity: BLOCK until context changes.
- Measurement source unknown or inconsistent: BLOCK automatic admission.

## Expected output
Projected token ledger, admission decision, reason code, protected-context list, and post-compaction measurement when applicable.

## Metrics
Projected vs actual input error; tokens/task; compactions/task; overflow errors/task; latency/task; cost/task; context utilization at send; task success; critical-context-loss incidents.

## Verification
Replay boundary cases around the configured threshold and hard capacity. Confirm large pending additions trigger before-send compaction rather than provider overflow.

## Failure handling
Retry token measurement once when a tokenizer service is temporarily unavailable. If still unresolved, use a conservative approved fallback or block the request.

## Stop conditions
Stop after two compaction attempts that fail to produce admissible context. Escalate rather than repeatedly summarizing or evicting required context.