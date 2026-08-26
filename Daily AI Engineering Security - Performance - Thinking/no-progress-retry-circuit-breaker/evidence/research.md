# Research — No-Progress Retry Circuit Breaker

**Topic:** Agent runtimes can repeatedly retry stalled or deterministic-failure steps without enough evidence of progress.

**Category:** Thinking

**Research date:** 2026-08-27 (UTC+7)

## Problem
Long-running AI agents need retry and recovery, but current public reports show retry loops that restart healthy work, repeat deterministic failures, or emit continuation turns without producing any state change. The engineering gap is not simply "too many retries": runtimes often lack an explicit progress contract, error-signature deduplication, checkpoint reuse, bounded retry budgets, and observable stop conditions.

## Why it matters now
August 2026 issue reports from both Anthropic Claude Code and OpenAI Codex describe substantial wasted time/tokens and zero-progress loops in real coding-agent workflows.

## Affected users
Developers using coding agents, AI-agent platform teams, multi-agent orchestrators, CI automation authors, and users delegating long-running repository tasks.

## Current public evidence

### Observed evidence
1. Claude Code issue #85206, opened 2026-08-09, reports a workflow stall watchdog repeatedly killing an actively working subagent and restarting from scratch. The reporter estimated four attempts consumed about 580k tokens with zero lines changed, and argued the watchdog was keyed to elapsed time rather than meaningful activity.  
   https://github.com/anthropics/claude-code/issues/85206
2. Claude Code issue #85265, opened 2026-08-09, reports healthy long-running subagents being aborted at an exact 600-second watchdog boundary; resumed tasks could complete normally, indicating some kills were false positives.  
   https://github.com/anthropics/claude-code/issues/85265
3. OpenAI Codex issue #34735, opened July 2026, reports deterministic tool failures being retried many times without a per-error retry limit, identical-call deduplication, or usage guard.  
   https://github.com/openai/codex/issues/34735
4. OpenAI Codex issue #37800, opened 2026-08-10, reports an automatic continuation loop in a long-running task that consumed tokens while repeatedly indicating continuation without meaningful file edits or progress.  
   https://github.com/openai/codex/issues/37800
5. OpenAI Codex issue #38132, opened 2026-08-12, reports a coordinator entering a tool-selection loop while trying to query subagent state, repeatedly routing to placeholder shell output rather than the intended collaboration tools.  
   https://github.com/openai/codex/issues/38132

### Interpretation
These incidents share a decision-control failure: retries are authorized by elapsed time, generic failure state, or model continuation rather than by observable evidence that the next attempt is materially different. Without a progress ledger and retry key, the runtime cannot distinguish productive slow work, transient failure, deterministic repeated failure, and semantic no-progress loops.

## Existing approaches
- Fixed wall-clock watchdogs.
- Automatic retry/backoff.
- Manual interrupt/resume.
- Tool-specific timeout settings.
- Parent-agent status polling.
- Model instructions to "try a different approach."

## Remaining limitations
- Wall-clock time alone does not distinguish slow progress from a true stall.
- Retrying from scratch discards useful checkpoints and repeats repository exploration.
- Backoff changes timing but not the deterministic inputs that caused failure.
- Model-level instructions are not enforceable retry limits.
- Usage/token budgets may be observed but not coupled to a circuit breaker.
- Parent agents can misclassify filler/continuation text as progress.

## Root-cause analysis
1. No normalized progress event model across model output, tool calls, file changes, tests, and checkpoints.
2. No stable retry key combining operation, normalized arguments, failure signature, and relevant state version.
3. Retry counters are often scoped to a single invocation rather than the logical task.
4. Checkpoint state is not always reused after interruption.
5. Stop conditions are advisory natural language instead of deterministic runtime gates.
6. Verification of "progress" is too often based on assistant text rather than external state change.

## Improvement opportunity
Create a deterministic progress ledger and retry circuit breaker. Every attempt records a retry key, evidence-bearing progress events, failure signature, resource consumption, and checkpoint. Identical failures without new evidence consume a bounded retry budget. A watchdog may interrupt only when no qualifying progress heartbeat exists for the configured interval. Retry is allowed only when the next attempt changes at least one causal input, resumes from a checkpoint, or is explicitly approved. Completion must be independently verified from task outputs, not continuation text.

## Relevant sources
- Claude Code #85206: https://github.com/anthropics/claude-code/issues/85206
- Claude Code #85265: https://github.com/anthropics/claude-code/issues/85265
- OpenAI Codex #34735: https://github.com/openai/codex/issues/34735
- OpenAI Codex #37800: https://github.com/openai/codex/issues/37800
- OpenAI Codex #38132: https://github.com/openai/codex/issues/38132
