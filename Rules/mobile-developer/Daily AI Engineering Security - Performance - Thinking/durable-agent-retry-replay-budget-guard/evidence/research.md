# Research — Durable Agent Retry Replay Budget Guard

## Topic
Preventing full-turn replay storms when durable or long-running AI agents retry failures without a useful checkpoint or changed request.

## Category
Performance

## Problem
Agent runtimes often classify provider, stream, or tool failures as retryable. If the retry restarts an entire expensive subagent turn from the beginning, reuses the same failing input, or lacks a committed checkpoint, one transient or deterministic failure can amplify into tens of minutes of repeated work and tens of millions of tokens.

## Why it matters now
Recent 2026 issue reports show this failure mode in multiple agent stacks. The cost is not only latency; repeated model calls, tool calls, and replayed reasoning can consume very large token budgets while the parent task appears merely "running".

## Affected users
Agent-runtime authors, coding-agent teams, platform operators, developers using durable workflows, and users paying for token-intensive long-running tasks.

## Observed evidence
1. Vercel Eve issue #1227, opened 2026-07-26, reports an AI Gateway stream-desynchronization error classified as recoverable. Durable retry replayed the subagent's entire turn from scratch, producing 15–70 minute loops and runs reaching 50–69M tokens: https://github.com/vercel/eve/issues/1227
2. OpenCode issue #37258, opened 2026-07-16, reports reasoning-only stream failures retrying the same final LLM call indefinitely after tool work had completed. One sanitized observation reached 25 attempts over about 63 minutes while the parent task remained running: https://github.com/anomalyco/opencode/issues/37258
3. Hermes Agent issue #73777, opened 2026-07-29, reports HTTP 200 responses with empty content being retried up to three times with unchanged input, adding roughly 35–40 seconds and weak diagnostics that make it hard to determine whether retry is useful: https://github.com/NousResearch/hermes-agent/issues/73777
4. OpenAI's July 29, 2026 efficiency guidance notes that repeated agent-loop inputs are expensive, and recommends avoiding context bloat and preserving reusable prompt prefixes for caching: https://openai.com/index/gpt-5-6-frontier-intelligence-efficiency/

## Existing approaches
- Generic exponential backoff.
- Fixed maximum retry counts.
- Durable workflow step retry.
- Provider SDK automatic retry.
- Parent-task timeouts.
- Prompt caching to reduce repeated-prefix compute.

## Remaining limitations
Backoff reduces request rate but not duplicated expensive work. A retry count can still permit huge replays if a single turn is costly. Durable retries may restart from the last workflow step rather than the last meaningful agent checkpoint. Provider retries often cannot distinguish transient transport failure from deterministic malformed or semantically unchanged requests. Parent timeouts cap wall time but may still allow large token waste before cancellation. Prompt caching can reduce compute cost but does not fix incorrect replay semantics.

## Root-cause analysis
- Retryability is classified by coarse error type instead of evidence that retry can change the outcome.
- Agent state is committed too infrequently.
- Retry budgets count attempts but ignore replayed tokens, tool calls, and wall time.
- Identical request fingerprints are retried without mutation or new evidence.
- Partial successful work is not checkpointed before the failing stream segment.
- Parent and child retry budgets are not coordinated.
- Operators lack diagnostics showing request fingerprint, checkpoint age, replay cost, and progress delta.

## Improvement opportunity
Introduce a replay-aware retry gate that tracks request fingerprints, progress/checkpoint IDs, replayed tokens, tool-call count, wall time, and no-progress cycles. Permit retry only when the failure is plausibly transient or the request/state changed; resume from the newest safe checkpoint; block identical no-progress replays after a small budget; and escalate instead of silently looping.

## Goal
Bound failure amplification while preserving useful recovery from transient errors.

## Metrics
- Replay amplification ratio = replayed tokens / useful completed-turn tokens.
- Duplicate request fingerprint count.
- No-progress retry count.
- Recovery latency.
- Tokens and tool calls spent after first failure.
- Percentage of retries resumed from newest safe checkpoint.
- False-stop rate for genuinely transient failures.

## Trigger
Before retrying a failed model/tool/subagent step in a durable or long-running agent workflow.

## Inputs
Failure class, request fingerprint, checkpoint ID, progress sequence, estimated input/output tokens, tool-call count, elapsed time, retry count, retry policy, and whether request/state changed.

## Outputs
`retry`, `resume_checkpoint`, `mutate_then_retry`, `escalate`, or `stop`; remaining budgets; decision reasons; audit metrics.

## Interpretation
These reports do not imply all retries are harmful. They show that retry correctness depends on progress, state, and cost, and that attempt-count-only policies can amplify failures dramatically.

## Proposed solution
A reusable replay-budget policy, deterministic retry gate, performance investigation skill, verifier subagent, bounded recovery workflow, blocking pre-retry hook, and explicit observability fields.

## Relevant sources
- https://github.com/vercel/eve/issues/1227
- https://github.com/anomalyco/opencode/issues/37258
- https://github.com/NousResearch/hermes-agent/issues/73777
- https://openai.com/index/gpt-5-6-frontier-intelligence-efficiency/
