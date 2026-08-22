# Research — Context Compression Behavioral Drift Gate

## Topic
Context Compression Behavioral Drift Gate

## Category
Token

## Problem
Long-running agents increasingly compact or summarize context to stay within model limits. Compaction can reduce token usage while silently changing task-critical behavior: dropping constraints, domain vocabulary, tool sequencing expectations, unresolved decisions, or evidence needed for verification.

## Why it matters now
Current agent frameworks are actively shipping and debugging automatic context compression. Recent public reports show both incorrect compaction triggers and concern about post-compression behavioral drift, making token reduction alone an insufficient success criterion.

## Affected users
Developers running long coding agents, multi-tool agents, RAG agents, support agents, autonomous workflows, and teams using automatic summarization or memory compression.

## Current public evidence
### Observed evidence
1. LangChain Deep Agents issue #2310 (2026-03-28) explicitly requested behavioral-drift detection alongside context compression, noting silent changes in vocabulary and tool-call patterns after compression: https://github.com/langchain-ai/deepagents/issues/2310
2. OpenClaw issue #118772 (2026-08-03) reports premature compaction caused by inflated cumulative token accounting, firing at only 4–8% of configured context and risking session-state/data loss: https://github.com/openclaw/openclaw/issues/118772
3. Hermes Agent issue #39691 (2026-06-05) documents weaknesses in conversation-level compression, including inaccurate triggering and cases where compression can increase prompt size rather than reduce it: https://github.com/NousResearch/hermes-agent/issues/39691

## Existing approaches
- Trigger summarization when estimated token usage crosses a threshold.
- Offload old tool results or tool inputs.
- Replace prior conversation with an LLM-generated summary.
- Use provider-side prompt caching to reduce cost without changing content.
- Manually pin important system instructions.

## Remaining limitations
Most approaches measure whether context became smaller, not whether task-critical behavior survived. Summaries can preserve broad semantics while dropping exact constraints, identifiers, negative requirements, pending hypotheses, provenance, or tool-state details. Token estimators can also trigger compression at the wrong time.

## Root-cause analysis
- Compression objectives optimize size, not information criticality.
- Important context is not explicitly classified before compaction.
- Pre/post behavior is rarely compared using deterministic probes.
- Token accounting may mix cumulative usage with current prompt size.
- Summaries are often trusted without a semantic preservation gate.
- Regression checks focus on overflow prevention rather than task quality.

## Improvement opportunity
Add a deterministic pre/post compaction gate. Before compression, extract a compact preservation contract containing required facts, constraints, decisions, unresolved items, tool-state references, and critical identifiers. After compression, verify those invariants, compare token counts, and optionally run task-specific probe checks. Reject or retry compaction when critical invariants disappear or token savings are negligible.

## Goal
Reduce context tokens and cost while preserving correctness-critical information and observable agent behavior.

## Metrics
- Input tokens before/after compaction.
- Compression ratio.
- Required-invariant retention rate.
- Critical-identifier retention rate.
- Probe pass rate.
- Post-compaction task regression rate.
- Number of rejected compression attempts.

## Trigger
Before and after any automatic context summarization, offloading, history truncation, or memory compression operation.

## Inputs
Original context snapshot, compacted context, preservation contract, optional token counts, and optional task probes.

## Outputs
Allow/reject decision, missing invariants, token-reduction metrics, probe results, and audit evidence.

## Interpretation
The evidence does not prove that every compaction system causes drift. It demonstrates recurring implementation problems and a documented gap: systems often lack explicit verification that compression preserved behavior-critical information.

## Proposed solution
A reusable compression-verification package that measures real prompt size, captures required invariants before compression, validates them after compression, enforces minimum useful savings, and blocks completion when correctness-critical context is lost.