# Research Evidence

## Topic
Reasoning Visible Completion Contract

## Category
Thinking

## Problem
Agent runtimes often treat provider termination metadata as equivalent to task completion. With reasoning-capable models, the provider can return `stop` while the visible answer channel is empty, or return `length` after spending the output budget on reasoning. Without an explicit observable completion contract, frameworks either silently accept an empty result or enter expensive retry loops.

## Why it matters now
Reasoning-channel separation is now common across OpenAI-compatible, Anthropic-style, local-model, and agent framework adapters. Multiple 2026 issues independently report empty terminal turns, silent success, or non-convergent continuation. This affects unattended coding agents, user-facing agents, scheduled jobs, and multi-turn state quality.

## Affected users
Agent framework maintainers; developers integrating reasoning models; platform teams operating unattended agents; users of coding agents and local model servers; teams measuring workflow completion from provider stop reasons.

## Current public evidence
### Observed evidence
1. **AgentScope Java #2750**, opened 2026-08-17: a ReActAgent accepted a final response containing a ThinkingBlock but no TextBlock, with `finish_reason=stop` and no tool call. AG-UI emitted no text events and the run finished without warning. The issue proposed a bounded post-reasoning continuation or stricter completion check.
2. **OpenAI Codex #37879**, opened 2026-08-10: large GPT-5.6 Luna agent conversations reportedly returned HTTP-successful terminal turns with no assistant text/tool calls and no explicit error, while clients treated them as successful stops and quota could still be consumed.
3. **LM Studio #1602**, opened 2026-03-04: reasoning-capable models could populate `reasoning_content` while `content` was empty and `finish_reason="stop"`; downstream consumers that trusted stop status silently accepted an empty response.
4. **Hermes Agent #83915**, opened 2026-08-11: a `finish_reason="length"` reasoning-only response triggered four continuation attempts that still could not converge; the reporter measured five calls, 77 minutes of GPU time, and an empty result. This demonstrates that retries need evidence-based stop conditions.
5. **LiveKit Agents #4066** (Nov 2025, still relevant implementation precedent): Gemini occasionally returned STOP with empty text/no function calls; treating that as a successful ChatChunk prevented fallback behavior. The framework added explicit handling for empty responses.

## Existing approaches
- trust provider finish/stop reason;
- retry/nudge on empty responses;
- fallback to another model/provider;
- post-reasoning middleware that checks response blocks;
- structured-output validators that reject shape-invalid success;
- user-interface timeouts or silence detectors.

## Remaining limitations
- `stop` does not prove a visible deliverable exists;
- “text must be non-empty” breaks valid tool-call, structured-output, and intentional-no-reply cases;
- retries without a cap can repeatedly purchase the same failure;
- a `length` result needs truncation/recovery semantics, not final-success semantics;
- placeholder strings such as “No response generated” can hide the true empty state from downstream automation;
- model-specific reasoning fields differ, so the contract must be channel-agnostic and based on allowed observable outcomes.

## Root-cause analysis
1. **Termination/completion conflation:** protocol termination metadata is treated as business-level completion.
2. **Channel mismatch:** adapters recognize reasoning content but final-delivery logic only inspects text, or vice versa.
3. **Incomplete outcome model:** runtimes lack a typed distinction among text, tool action, structured output, intentional silence, truncation, and invalid empty terminal.
4. **Unbounded or low-information recovery:** retries repeat without proving the failure mode changed.
5. **Observability gap:** silent terminal empties may produce neither error logs nor user-visible failure events.

## Interpretation
The engineering target is not “make models reason less” or inspect hidden reasoning. It is to make completion explicit and observable. A workflow should finish only when its externally consumable outcome satisfies a typed contract.

## Improvement opportunity
Provide a provider-agnostic trace validator and workflow that classifies terminal turns, blocks silent empty success, handles truncation separately, allows explicit non-text outcomes, measures recovery, and caps retries.

## Relevant sources
- https://github.com/agentscope-ai/agentscope-java/issues/2750
- https://github.com/openai/codex/issues/37879
- https://github.com/lmstudio-ai/lmstudio-bug-tracker/issues/1602
- https://github.com/NousResearch/hermes-agent/issues/83915
- https://github.com/livekit/agents/issues/4066

## Evidence boundary
Reports are project-specific and do not prove all reasoning models fail this way. The package addresses the shared runtime failure mode: accepting an externally unusable terminal turn as complete or retrying it without a bounded recovery contract.
