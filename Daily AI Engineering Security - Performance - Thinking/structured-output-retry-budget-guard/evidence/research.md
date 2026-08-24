# Research

## Topic
Bounded structured-output recovery for AI agents

## Category
Thinking

## Problem
Agents can complete substantive work and then loop indefinitely or fail unreliably while trying to satisfy a terminal structured-output schema. Retry behavior differs across frameworks, and a single wedged subagent can block downstream verification.

## Why it matters now
Structured output is increasingly used for multi-agent handoffs, workflows, evaluators and tool orchestration. Recent 2026 reports show large token/time waste and reliability failures specifically at this output boundary.

## Affected users
Coding-agent users, workflow authors, multi-agent platform builders, evaluation pipelines, and teams requiring machine-readable agent results.

## Current public evidence
### Observed evidence
1. Claude Code issue #68093 (2026-06-12) reports a parallel workflow subagent entering 229 consecutive empty StructuredOutput calls after useful work, with no retry cap or per-agent timeout, stalling the whole barrier. https://github.com/anthropics/claude-code/issues/68093
2. Claude Code issue #67311 (2026-06-11) reports 395 schema-validation StructuredOutput attempts, ~844 events and ~1.6 MB transcript after the agent's investigation had already completed. https://github.com/anthropics/claude-code/issues/67311
3. Strands Agents TypeScript issue #1039 (2026-05) reports a structured-output forced-retry path producing an invalid conversation sequence on Bedrock/Anthropic-family models, showing retry behavior can itself introduce a new failure. https://github.com/strands-agents/sdk-typescript/issues/1039
4. LangChain issue #38719 (2026-07-08) reports raw JSON-schema dict structured output is not locally validated, making documented validation-error retry machinery unreachable for that schema representation. https://github.com/langchain-ai/langchain/issues/38719
5. Zeroshot issue #447 (2026-03-12) argues that malformed structured output should trigger repair of the exact raw completed output rather than rerunning the full task, because the task may have succeeded and only terminal formatting failed. https://github.com/the-open-engine/zeroshot/issues/447

## Interpretation
The shared reliability gap is that structured-output completion is often coupled too tightly to the main agent loop. Local validation, bounded retry/repair, repeated-failure detection and workflow-level liveness need to be executor-owned invariants rather than model discretion.

## Existing approaches
- model/tool retry after schema errors
- provider-native structured output
- max-turn limits
- manual TaskStop/kill
- whole-task rerun
- framework-specific reformatters

## Remaining limitations
- retry loops may have no narrow terminal-output budget
- identical invalid payloads may not be detected
- generic max-turn limits waste all earlier useful work
- full-task reruns are expensive and can create new side effects
- schema validation semantics can vary by schema representation/provider
- parallel barriers can wait forever on one wedged child

## Root-cause analysis
1. Validation and retry policy are delegated to the same model loop that produced the invalid output.
2. Task execution state and output-format state are conflated.
3. Retry attempts lack failure fingerprints and bounded counters.
4. Workflow liveness is not guaranteed by per-agent terminal deadlines.
5. Raw completed output is not always retained as a repair source of truth.

## Improvement opportunity
Move terminal validation/retry control into the executor: capture raw output, validate locally, classify failure, repair only the raw artifact within a small budget, fingerprint repeated failures, enforce a terminal deadline, then fail explicitly rather than rerunning indefinitely.

## Proposed solution
This package supplies a retry-budget policy, deterministic event guard, recovery skill, enforceable rules, verifier role, workflow and hook contract. Host frameworks provide their own schema validator; this package governs what happens around validation failures.

## Metrics
Invalid attempts/task, repeated-invalid count, repair attempts, repair success rate, post-work token burn, terminal-output latency, stuck-child incidence, full-task reruns avoided, unsupported-field regression rate.

## Trigger
Any schema/extraction/parse failure after a model or subagent has produced its substantive result.

## Inputs
Raw output, declared schema, exact validation error, ordered terminal-attempt events, retry policy.

## Outputs
Accept, repair-allowed, or stop decision; evidence fingerprint; retry counts; final validation status.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/68093
- https://github.com/anthropics/claude-code/issues/67311
- https://github.com/strands-agents/sdk-typescript/issues/1039
- https://github.com/langchain-ai/langchain/issues/38719
- https://github.com/the-open-engine/zeroshot/issues/447
