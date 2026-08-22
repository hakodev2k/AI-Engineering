# Research — Approval Round Context Overhead Profiler

## Topic
Approval Round Context Overhead Profiler

## Category
Performance

## Problem
Human/tool approval middleware can re-enter an agent once per approval round. If context providers perform DB-backed memory lookup, RAG, summarization, or other expensive work on every agent invocation, tool-heavy turns can multiply that work by the number of approval rounds and hit timeouts.

## Why it matters now
Recent Microsoft Agent Framework reports show approval handling and resume paths still create measurable orchestration overhead and repeated execution paths in current production agent stacks.

## Affected users
Agent platform teams, .NET/Python agent-framework users, applications with expensive context providers, and systems with many tool rounds or human approvals.

## Current public evidence
### Observed evidence
1. Microsoft Agent Framework issue #6825, opened June 30, 2026, reports that ToolApprovalAgent re-invokes the inner agent per approval batch, re-running AIContextProvider.InvokingAsync each round. A tool-heavy turn produced 70+ re-invocations and exceeded a streaming timeout: https://github.com/microsoft/agent-framework/issues/6825
2. Issue #6910, opened July 4, 2026, reports approval/session contract mismatch in AG-UI that causes dropped calls and re-issued tool calls, adding repeated work and loops: https://github.com/microsoft/agent-framework/issues/6910
3. Issue #7043, opened July 10, 2026, reports approved provider-injected tools failing before before_run registration, after which the agent retries the same call and can loop through approval again: https://github.com/microsoft/agent-framework/issues/7043

### Interpretation
Approval is a correctness and safety boundary, but orchestration around it can amplify context-loading cost. Optimization must preserve approval semantics while measuring repeated provider work and identifying safe caching or run-scoping opportunities.

## Existing approaches
- Re-invoke the complete agent after each approval response.
- Auto-approval rules for selected tools.
- Application-specific caching inside context providers.
- Removing approval requirements from read-only tools.

## Remaining limitations
- Re-invocation can repeat context-provider work even when context inputs are unchanged.
- Application caches may not expose whether repeated provider calls are actually avoidable.
- Removing approval is not acceptable for tools that genuinely require it.
- Fragile framework-internal workarounds can break across versions.

## Root-cause analysis
1. Context-provider lifecycle is tied to agent invocation rather than logical user turn.
2. Approval resume creates additional invocations inside one logical turn.
3. Providers often lack stable input fingerprints and per-turn reuse policy.
4. Telemetry does not always separate logical turn, approval round, provider invocation, and model/tool round.
5. Performance workarounds can accidentally weaken approval boundaries.

## Improvement opportunity
Add framework-neutral instrumentation that fingerprints provider inputs, records logical-turn and approval-round identifiers, calculates repeated provider work, and recommends only evidence-backed reuse candidates. Optional caching is restricted to providers explicitly marked deterministic/read-only for a stable fingerprint.

## Goal
Reduce repeated context-provider cost across approval rounds without bypassing, auto-granting, or weakening required approvals.

## Metrics
- context_provider_invocations_per_turn
- repeated_provider_invocations
- provider_time_ms_per_turn
- approval_round_count
- model/tool rounds
- p50/p95 turn latency
- timeout rate
- cache reuse rate
- correctness regression rate

## Trigger
At logical turn start, before/after each context-provider invocation, and at approval resume.

## Inputs
Telemetry JSONL containing turn_id, approval_round, provider, input fingerprint fields, duration_ms, result fingerprint, and status.

## Outputs
Baseline report, repeated-work groups, safe-reuse candidates, before/after comparison, and blocking regressions.

## Relevant sources
- https://github.com/microsoft/agent-framework/issues/6825
- https://github.com/microsoft/agent-framework/issues/6910
- https://github.com/microsoft/agent-framework/issues/7043
