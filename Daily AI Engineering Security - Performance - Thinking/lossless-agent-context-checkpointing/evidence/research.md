# Research — Lossless Agent Context Checkpointing

## Problem
Long-running coding and agent sessions increasingly rely on context compaction to stay within model limits. Current compaction approaches can fail at or near the context boundary, discard operationally important state, lose recoverable tool state after truncation, or force users to abandon a session and reconstruct task state manually.

## Category
Token

## Why it matters now
Recent public reports in August 2026 show several distinct but related failure modes across agent products:

- Codex issue #37121, opened 2026-08-05, reports that when a large tool/function result is truncated and the thread then compacts, continuation can lose access to recoverable tool state that still exists elsewhere in persisted rollout data.
- Codex issue #36721, opened 2026-08-03, requests structured, cost-aware context checkpoints with a lossless operational tail because ordinary compaction can lose what succeeded, failed, changed, was tested, and should happen next.
- Codex issue #36669, opened 2026-08-03, requests active selective compaction rather than only automatic/manual compaction.
- Codex issue #29319 reports automatic compaction triggering at a full 258k/258k window and then failing with a context-window error instead of recovering the thread.
- Claude Code issue #79989, opened 2026-07-22, reports sessions above 200k tokens becoming unrecoverable after prompt cache goes cold, with `/compact` failing because compaction itself sends the oversized request.
- Claude Code issue #83355, opened 2026-08-02, reports subagent auto-compaction using the main session context window rather than the subagent model’s smaller limit, allowing the subagent to hit a 400 error before compaction.

OpenAI’s current model guidance documents response compaction as the mechanism for extending long-running tool-heavy workflows, but explicitly recommends monitoring context usage, compacting after major milestones rather than every turn, preserving functionally equivalent prompts when resuming, and treating compacted items as opaque. This means production agents still need application-level orchestration around when to compact and what operational state must be preserved outside the opaque compacted representation.

## Observed evidence

### Signal 1 — Recoverable tool state can be lost across truncation + compaction
Source: https://github.com/openai/codex/issues/37121

Observed report:
- large tool/function output is truncated;
- thread compacts afterward;
- continuation loses data that remains present in persisted rollout state;
- issue is labeled around context, session, tool calls, and CLI behavior.

Interpretation: compaction is not equivalent to a complete durable task checkpoint. Tool state that matters for continuation needs an explicit durable representation.

### Signal 2 — Users are requesting structured operational checkpoints
Source: https://github.com/openai/codex/issues/36721

Observed report:
- ordinary long-conversation compaction can reduce continuation quality;
- particularly vulnerable state includes successful/failed actions, decisions, changed files, tests run, and the next concrete action;
- request proposes a structured checkpoint plus a lossless operational tail.

Interpretation: the information needed to continue an engineering task is smaller than full history but more structured than a free-form summary.

### Signal 3 — Existing compaction controls are not selective enough
Source: https://github.com/openai/codex/issues/36669

Observed report:
- Codex exposes automatic/manual compaction and lifecycle hooks;
- request asks for model-callable context inspection and selective compaction.

Interpretation: applications benefit from explicit policies that decide when to checkpoint/compact based on context composition, not only a fixed near-limit trigger.

### Signal 4 — Compaction can become impossible exactly when needed
Sources:
- https://github.com/openai/codex/issues/29319
- https://github.com/anthropics/claude-code/issues/79989

Observed reports:
- Codex automatic compaction reached full context and failed instead of recovering.
- Claude Code long-context sessions could become unrecoverable when cache was cold because compaction itself required a request exceeding a problematic threshold.

Interpretation: waiting until the hard boundary is unsafe. A recovery reserve and proactive checkpoint threshold are needed.

### Signal 5 — Mixed-model agents can use the wrong context budget
Source: https://github.com/anthropics/claude-code/issues/83355

Observed report:
- a subagent with a smaller context model inherited the coordinator’s context-window assumption for auto-compaction;
- the subagent then exceeded its real model limit and failed.

Interpretation: token budgets must be computed per active model/agent, not globally inherited from the coordinator.

### Signal 6 — Official OpenAI guidance already recommends proactive compaction
Sources:
- https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.2
- https://developers.openai.com/api/reference/java/resources/responses/methods/compact

Observed guidance:
- use compaction for long-running, tool-heavy workflows;
- monitor context usage;
- plan ahead rather than wait for the maximum window;
- compact after major milestones;
- keep prompts functionally equivalent after resume;
- treat compacted items as opaque.

Interpretation: a host-side checkpoint protocol complements opaque model/API compaction rather than replacing it.

## Existing approaches
1. Wait for the platform’s automatic compaction threshold.
2. Manually invoke `/compact` or an equivalent command.
3. Use a free-form natural-language summary before clearing/resuming.
4. Depend on persisted conversation history and replay it later.
5. Rely on prompt cache to reduce cost of repeated history.
6. Keep large tool outputs in the conversation and trust platform truncation.

## Observed limitations
- Automatic thresholds may fire too late.
- Manual compaction requires user awareness and can still fail when the request itself is oversized.
- Free-form summaries can omit operational facts, especially failed approaches, unresolved blockers, file changes, commands, and verification state.
- Full replay is token-expensive and may be impossible under a smaller resumed model.
- Prompt cache improves reuse economics but is not a correctness or durability mechanism.
- Tool-output truncation may remove the exact values needed later.
- A coordinator’s context limit may not match a delegated subagent’s model limit.
- Opaque compaction output is intentionally not designed as an application-readable audit/checkpoint format.

## Root-cause hypotheses
1. Context management is treated as transcript compression rather than durable workflow-state management.
2. Critical operational state is encoded only in natural-language conversation and tool output.
3. Checkpoint thresholds use the maximum model window instead of a reserve-aware soft limit.
4. Context accounting is global instead of model/agent specific.
5. Tool-result references are not separated into durable artifacts and compact references.
6. Compaction quality is not verified against explicit invariants before old context is evicted.
7. Recovery paths are designed after compaction rather than before it.

## Improvement target
Create a reusable checkpoint layer that runs before platform compaction and serializes task-critical state into a small, deterministic, versioned checkpoint. The checkpoint is not a hidden reasoning trace. It stores observable engineering state only: goals, constraints, facts, assumptions requiring validation, decisions, changed files, commands/tests, tool artifacts, blockers, next actions, verification status, and resume instructions.

The layer should:
- compute per-agent token budgets;
- reserve recovery headroom;
- trigger checkpointing at milestones or soft thresholds;
- persist large tool results externally and retain stable references/hashes;
- validate checkpoint completeness with invariants;
- keep a short operational tail after checkpoint creation;
- compact only after checkpoint verification succeeds;
- restore from checkpoint if compaction/resume fails;
- track token savings and recovery success.

## Success metrics
- 100% of checkpointed sessions preserve required operational fields.
- 100% of referenced external artifacts include path/URI plus content hash when available.
- No compaction is initiated after the configured hard-stop threshold.
- Soft-threshold checkpoint creation succeeds before the recovery reserve is consumed.
- Resume validation detects missing changed-file/test/blocker state before continuation.
- Token footprint after checkpoint + operational tail is measurably lower than full transcript replay.
- Recovery drills can resume a synthetic task without re-reading the full prior transcript.

## Evidence / interpretation / proposed solution boundary
- **Observed evidence:** the public issue reports and official docs listed above.
- **Interpretation:** long-running agents need an application-readable durable workflow checkpoint in addition to model/platform compaction.
- **Proposed engineering solution:** the checkpoint schema, thresholds, validator, workflow, hooks, and scripts in this package are a reusable design inferred from the evidence. They are not claimed to be an official OpenAI or Anthropic protocol.