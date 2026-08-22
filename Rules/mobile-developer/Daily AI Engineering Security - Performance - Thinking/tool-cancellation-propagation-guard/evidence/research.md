# Research — Tool Cancellation Propagation Guard

## Topic
Tool Cancellation Propagation Guard

## Category
Performance

## Problem
Agent runtimes can stop the model loop while leaving an in-flight tool, stream, subprocess, or reconnect path alive. The user believes the run is cancelled, but compute, network calls, child processes, and state mutation may continue.

## Why it matters now
Recent 2026 reports across multiple agent SDKs show the same lifecycle gap in different implementations: cancellation signals stop orchestration but fail to reach tool execution or resumed streams. This wastes resources, creates stuck runs, and can produce late writes after the caller has abandoned the task.

## Affected users
Agent SDK consumers, CI/automation owners, platform builders, tool authors, developers running shell/browser/MCP/database tools, and services with long-lived streaming agents.

## Current public evidence
### Observed evidence
1. OpenAI Agents JS issue #1521 (2026-07-26) reports `RunOptions.signal` not reaching tool execution; cancelling the run leaves in-flight tools running. The issue was fixed through follow-up work, demonstrating the lifecycle boundary is concrete rather than theoretical: https://github.com/openai/openai-agents-js/issues/1521
2. GitHub Copilot SDK issue #1433 (2026-05-26, open) requests propagating `AbortSignal` through `ToolInvocation` because `session.abort()` stops future scheduling but current tool handlers keep running: https://github.com/github/copilot-sdk/issues/1433
3. Vercel AI issue #15430 (2026-05-19) reports cancelled streaming runs whose promises never settle because abort does not propagate through the full stream lifecycle: https://github.com/vercel/ai/issues/15430
4. Vercel AI issue #18458 (2026-08-05) reports `stop()` failing on resumed streams because reconnect paths omit the abort signal: https://github.com/vercel/ai/issues/18458
5. OpenAI Codex issue #34802 (re-evaluated 2026-07-22) calls out process-tree-aware abort as a missing hardening control for automation: https://github.com/openai/codex/issues/34802

## Existing approaches
- Pass a cancellation token/signal to the top-level model call.
- Configure per-tool timeouts.
- Stop scheduling additional tool calls after cancellation.
- Kill a direct subprocess from the host.
- Rely on provider/serverless termination.

## Remaining limitations
Top-level cancellation is insufficient when adapters forget to forward the signal. Timeouts can be much longer than the desired cancellation latency. Killing only the direct child can leave descendants alive. Resumed/reconnected streams may bypass the original cancellation path. Tool authors often have no contract requiring cooperative cancellation or idempotent cleanup.

## Root-cause analysis
- Cancellation ownership is fragmented across model, runner, tool, transport, and subprocess layers.
- New execution paths (resume, reconnect, nested agent, MCP adapter) are added without lifecycle conformance tests.
- Cancellation is treated as an optional convenience instead of an end-to-end invariant.
- Tool completion and cleanup are not represented as independently observable states.
- Process-tree cleanup differs by operating system and is often omitted.

## Improvement opportunity
Use a reusable cancellation contract that assigns one run-scoped cancellation identity, requires propagation through every adapter, measures cancel-to-quiescence latency, detects post-cancel activity, and blocks completion until owned resources are quiescent or explicitly reported leaked.

## Goal
Make cancellation end-to-end, observable, bounded, and regression-tested without weakening normal tool behavior.

## Metrics
- Cancel-to-tool-observed latency p95.
- Cancel-to-quiescence latency p95.
- Number of tool calls active 5 seconds after cancel.
- Number of post-cancel writes/events.
- Number of leaked child/descendant processes.
- Percentage of execution paths passing cancellation conformance tests.

## Trigger
User stop, host shutdown, deadline expiry, parent-agent cancellation, failed stream, workflow abort, or superseding request.

## Inputs
Run ID, cancellation signal/token, active tool registry, process metadata, stream metadata, timeout policy, and resource ownership map.

## Outputs
Cancellation audit record, propagation coverage, active-resource snapshot, quiescence decision, leak evidence, and bounded recovery action.

## Interpretation
The evidence shows a recurring integration failure class across SDKs. It does not imply every current version of every SDK remains affected.

## Proposed solution
A framework-neutral cancellation propagation and quiescence gate with deterministic event analysis, explicit adapter contracts, process/resource cleanup checks, and bounded verification workflows.

## Relevant sources
- https://github.com/openai/openai-agents-js/issues/1521
- https://github.com/github/copilot-sdk/issues/1433
- https://github.com/vercel/ai/issues/15430
- https://github.com/vercel/ai/issues/18458
- https://github.com/openai/codex/issues/34802
