# Research

## Topic
Stateful Agent Provider Failover Continuity

## Category
Performance

## Problem
Stateful AI agents often rely on one model provider for conversation IDs, streamed tool calls, approvals, retries and cached context. A provider outage or degraded API can leave the agent hanging, retrying, or unable to resume safely. Naive cross-provider fallback can also corrupt state because provider-specific tool-call identifiers, credential pools, response objects and streaming semantics are not interchangeable.

## Why it matters now
On September 3, 2026, OpenAI reported elevated errors across ChatGPT and Codex, while Anthropic separately reported a multi-model incident affecting Claude API and Claude Code for nearly three hours. The overlap shows that production agent platforms need bounded degradation and recovery rather than assuming uninterrupted provider availability. Public agent-framework issues also show that provider errors can produce silent stalls, state loss and broken fallback chains.

## Affected users
Agent-platform builders, coding-agent users, multi-agent orchestration teams, production assistants, gateway operators and developers running long-lived workflows with tools or human approvals.

## Current public evidence
### Observed evidence
1. OpenAI Status, 2026-09-03: elevated errors affected ChatGPT and four Codex components; mitigation and recovery occurred later that day.
2. Anthropic Status, 2026-09-03: elevated errors affected multiple Claude models, Claude API and Claude Code from 13:26 UTC until recovery at 16:16 UTC.
3. OpenClaw issue #48361 reported a provider-agnostic failure mode where an agent could go silent for 30+ minutes after a provider error, reproduced with Anthropic and OpenAI.
4. Hermes Agent issue #33088 documented cross-provider fallback state contamination: a fallback provider's 429 response was recorded against the primary OpenAI Codex credential pool.
5. OpenAI Agents SDK issues #3004 and #1435 show that resumable tool-call state is sensitive to provider/server conversation IDs and can fail when outputs and call IDs are not reconciled correctly.

### Interpretation
Availability handling for stateful agents is not only retry logic. It is a state-consistency problem across provider boundaries. A safe failover layer must decide which state is portable, which must be replayed, and which provider-specific identifiers must never cross the boundary.

### Proposed solution
Add a provider-failure circuit breaker plus a provider-neutral checkpoint envelope. Before failover, persist portable conversation facts, pending tool intents, completed tool outputs and approval state; strip provider-specific response/call identifiers; enforce idempotency for side-effecting tools; then either replay into a compatible provider or stop with a user-visible recoverable state. Measure outage stall time, retry count, failover success and duplicate-side-effect rate.

## Existing approaches
Retries with exponential backoff, model/provider fallback chains, API gateways, request timeouts, status checks and provider-specific conversation resume APIs are common. These improve availability when failures are transient and state is simple.

## Remaining limitations
- Repeated retries can amplify outages and delay visible failure.
- Provider-specific response IDs and tool-call IDs may not be portable.
- A fallback can inherit or contaminate primary credential/error state.
- Side-effecting tool calls may be duplicated if success occurred before a provider/network failure.
- Streaming truncation can leave ambiguous partial tool calls.
- Silent finalization failures can make an agent appear to be working indefinitely.

## Root-cause analysis
1. Transport retry and agent state recovery are treated as the same problem.
2. Provider-specific and provider-neutral state are not separated.
3. Circuit breakers do not share a common retry budget across SDK, gateway and agent layers.
4. Tool side effects lack durable idempotency/reconciliation before replay.
5. Failover success is measured by API response rather than end-to-end task continuity.

## Improvement opportunity
Use a portable checkpoint schema and bounded failover state machine: detect transient/provider failure; stop duplicate retry layers; checkpoint portable state; reconcile side effects; switch provider only when tool/schema compatibility is proven; replay portable context; verify terminal response and tool outputs; otherwise stop cleanly with evidence.

## Relevant sources
- OpenAI Status, "Elevated errors across ChatGPT and Codex", 2026-09-03: https://status.openai.com/incidents/01M1KWEDH417T2CF44YYHZDFCR
- Anthropic/Claude Status, incident history for 2026-09-03: https://status.claude.com/
- OpenClaw issue #48361: https://github.com/openclaw/openclaw/issues/48361
- Hermes Agent issue #33088: https://github.com/NousResearch/hermes-agent/issues/33088
- OpenAI Agents Python issue #3004: https://github.com/openai/openai-agents-python/issues/3004
- OpenAI Agents JS issue #1435: https://github.com/openai/openai-agents-js/issues/1435
