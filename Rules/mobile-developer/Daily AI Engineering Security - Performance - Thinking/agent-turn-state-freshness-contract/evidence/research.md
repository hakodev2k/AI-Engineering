# Research — Agent Turn-State Freshness Contract

**Run date:** 2026-08-20 (UTC+7)  
**Category:** Thinking

## Problem
Stateful agents can restore prior-turn terminal fields, outputs, lifecycle markers, or incomplete tool state into a new turn. The new request may begin executing correctly, yet routing or finalization can still be decided by stale state from the previous turn. Symptoms include premature exit, returning the previous structured response, emitting a stale final answer, or retrying from history that omits a tool result that already completed.

## Why it matters now
Modern agents increasingly use durable threads, checkpoints, structured-output state, replay, retries, and long-lived sessions. Those mechanisms improve reliability but also make state ownership explicit: persisted values survive turn boundaries unless the runtime resets or versions them correctly.

## Current public signals

### Signal 1 — LangChain `create_agent` can return the previous turn's structured response
LangChain issue #36957, opened 2026-04-22 and still open when researched, reports that `structured_response` restored from a checkpoint can satisfy an exit condition on the next turn. The reproduction expects turn 2 to return a new value but instead receives the structured response from turn 1; the next model response is never consumed. This is a concrete stale-state / premature-finalization defect.

Source: https://github.com/langchain-ai/langchain/issues/36957

### Signal 2 — Codex can finish a new request with a stale prior-turn final response
OpenAI Codex issue #30767, dated 2026-06-30, describes a new user request that triggers the correct tool activity while the final visible reply is still sourced from prior-turn workflow state. The reporter characterizes the failure as stale final-response ownership after a turn transition, especially in long-lived or compaction-heavy threads.

Source: https://github.com/openai/codex/issues/30767

### Signal 3 — Codex retry can rebuild from stale history and omit a completed tool output
OpenAI Codex issue #16255 reports that an interrupted stream may leave a completed custom tool call without its matching output in persisted history, while retry can reuse a prompt built before the session state was updated. The result is inconsistent history and an unrecoverable or stale retry path.

Source: https://github.com/openai/codex/issues/16255

### Signal 4 — replayed historical events can be confused with the current run
LangGraph issue #8358, opened 2026-07-17, reports that after thread hydration the initial protocol-v2 event replay lacks a durable run/checkpoint boundary that lets a client distinguish historical events from the newly started run. That is a transport-level version of the same ownership problem.

Source: https://github.com/langchain-ai/langgraph/issues/8358

## Existing approaches
1. **Checkpointed threads.** LangGraph persists graph state in checkpoints organized by `thread_id`, enabling resume, replay, fault tolerance, time travel, and human-in-the-loop flows.
2. **Structured response state.** LangChain places structured output in the agent's final `structured_response` state key.
3. **Run / response identifiers.** APIs and agent servers expose response, run, checkpoint, or thread identifiers that can be used as correlation data.
4. **Retry and normalization logic.** Runtimes attempt to reconstruct message history and validate tool-call/result ordering when a stream or tool operation fails.

Official references:
- https://docs.langchain.com/oss/python/langgraph/persistence
- https://docs.langchain.com/oss/python/langchain/structured-output
- https://docs.langchain.com/langsmith/use-threads
- https://platform.openai.com/docs/api-reference/responses-streaming/response/refusal/delta?lang=curl

## Observed limitations
- A thread identifier scopes a conversation but does not by itself prove that a value belongs to the current user turn.
- Generic persisted state may contain terminal values whose mere presence is used as an exit condition.
- Retry code can capture history before the latest durable write and then keep reusing that stale snapshot.
- Event consumers can observe replayed historical events without a reliable current-run boundary.
- Prompt instructions such as "answer the latest request" cannot repair a runtime that routes or finalizes before the model is called.

## Root-cause hypotheses
These are engineering interpretations of the observed reports, not claims about undisclosed vendor internals.

1. **Missing turn ownership metadata.** Persisted fields such as final response, structured result, completion flags, tool summaries, or approvals are not tagged with the turn/run that produced them.
2. **Presence-based routing.** Code checks whether a terminal key exists instead of whether it is fresh for the active turn.
3. **Turn initialization is append-only.** A new user input is added but stale terminal fields are not explicitly invalidated.
4. **Snapshot-before-retry.** Retry loops reuse a state snapshot created before in-flight tool results were persisted.
5. **Replay/live event ambiguity.** Consumers cannot always correlate an event to the active run boundary.

## Improvement target
Introduce a reusable **Turn-State Freshness Contract** at the orchestration boundary:

- assign a unique `turn_id` (and optionally `run_id`) before accepting mutable work for a new request;
- version every turn-scoped terminal field with `owner_turn_id`;
- clear or tombstone terminal fields during turn initialization;
- require all finalization predicates to prove `owner_turn_id == active_turn_id`;
- require tool outputs and important evidence to carry the active turn identity;
- rebuild retry inputs from the latest durable state after cleanup/drain, not from an earlier captured prompt;
- reject historical/replayed events as current evidence unless their run boundary matches;
- emit explicit stale-state violations rather than silently returning old output.

## Success metrics
- stale-final-response escapes per 1,000 multi-turn runs: **0** in the regression suite;
- stale structured-response early exits: **0**;
- terminal fields lacking owner metadata: **0**;
- finalizations whose evidence contains a foreign `turn_id`: **0**;
- retries using a state revision older than the latest persisted tool result: **0**;
- bounded recovery: maximum **1 automatic state refresh + 1 retry**, then stop/escalate;
- no regression in correct multi-turn memory retained outside turn-scoped terminal fields.

## Quality-gate conclusion
The problem is current, concrete, cross-framework, reproducible, and distinct from generic compaction or checkpoint continuity. Existing persistence mechanisms preserve state but do not universally enforce turn-level ownership. A deterministic contract plus validation tooling can reduce stale conclusions without exposing hidden chain-of-thought.
