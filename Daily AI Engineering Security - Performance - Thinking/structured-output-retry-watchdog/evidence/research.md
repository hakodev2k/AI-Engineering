# Research — Structured Output Retry Watchdog

**Topic:** Structured-output retry loops in agent workflows  
**Category:** Thinking  
**Research date:** 2026-08-27 (UTC+7)

## Problem
Agent/subagent workflows can complete their investigation but fail while serializing a required structured output, then retry the same invalid/empty output indefinitely. In parallel workflows, one wedged subagent can block downstream verification and consume large token/tool budgets.

## Why it matters now
Recent Claude Code reports show this is not theoretical: one issue documented 395 repeated StructuredOutput validation failures consuming an entire session; another documented 229 consecutive empty StructuredOutput calls after substantial legitimate work, with no per-agent timeout and a blocked parallel barrier.

## Affected users
Agent-framework maintainers, AI coding teams, multi-agent workflow builders, CI automation operators, and developers using JSON-schema-constrained outputs.

## Current public evidence
### Observed evidence
1. Claude Code issue #67311 (2026-06-11) reports 395 StructuredOutput retries after successful investigation because required schema fields were missing. The issue was marked duplicate, indicating an existing class of failures. Source: https://github.com/anthropics/claude-code/issues/67311
2. Claude Code issue #68093 (2026-06-12) reports a parallel subagent that made 229 consecutive empty StructuredOutput calls; lack of retry caps and per-agent timeout stalled the whole workflow. Source: https://github.com/anthropics/claude-code/issues/68093
3. Warp issue #13251 (2026-06-30) documents autonomous slow-command cancellation followed by retry loops, showing the broader agent-orchestration problem of unresolved tool states repeatedly consuming execution budget. Source: https://github.com/warpdotdev/warp/issues/13251

### Interpretation
The recurring engineering weakness is not model reasoning quality alone. The orchestration layer often lacks observable convergence criteria: repeated normalized failures are not deduplicated, retry budgets are not bound to failure signatures, and barrier stages do not degrade gracefully when one worker wedges.

## Existing approaches
- JSON schema validation and automatic retry.
- Global task timeouts.
- Manual cancellation / TaskStop.
- Generic loop detection based on exact repeated messages or tool calls.

## Remaining limitations
- Validation retry without signature-aware caps can amplify a persistent schema mismatch.
- Exact-match loop detectors can miss semantically identical failures with changing metadata.
- Global timeouts allow one subagent to waste most of the run budget before recovery.
- Parallel barriers often lack a policy for partial success and independent verification.

## Root-cause analysis
1. No canonical failure signature for invalid structured output.
2. Retry counters are not keyed by signature and stage.
3. Progress is inferred from activity rather than validated state changes.
4. Per-agent deadlines are missing or not tied to downstream barrier behavior.
5. Recovery may retry serialization instead of re-grounding required schema fields from evidence.

## Improvement opportunity
Add a deterministic watchdog that canonicalizes structured-output failures, tracks repeated signatures, enforces per-stage retry and wall-clock budgets, requires an evidence-bearing recovery step before another attempt, and returns a typed partial-failure state so downstream verification can continue safely.

## Goal
Prevent unbounded retries while preserving recoverable structured-output tasks.

## Metrics
- repeated-failure attempts per signature
- percentage of stalled workers terminated by watchdog
- workflow wall-clock saved
- token/tool calls avoided after convergence failure
- partial-result verification coverage
- unsupported-output rate after recovery

## Trigger
Any schema validation failure, empty structured output, or parallel worker exceeding progress deadline.

## Inputs
Validation error, normalized payload, schema identifier, worker/stage id, retry history, progress timestamps.

## Outputs
`retry`, `recover`, `fail-partial`, or `stop` decision with reason code and evidence.
