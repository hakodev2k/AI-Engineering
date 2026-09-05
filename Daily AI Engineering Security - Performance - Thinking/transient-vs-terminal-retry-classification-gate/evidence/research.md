# Research

## Topic
Transient vs Terminal Retry Classification Gate

## Category
Performance

## Problem
AI-agent systems exhibit both over-retry and under-retry: persistent failures can trigger long or indefinite retry loops, while transient failures can terminate expensive long-running workloads without a recovery attempt. Both patterns are operationally inefficient.

## Why it matters now
Recent public reports show the asymmetry across coding agents and AI training/inference tooling. The issue is not simply “retry more” or “retry less”; retryability must be classified and bounded using observable evidence.

## Affected users
AI-agent users, coding-agent developers, inference/training platform teams, orchestration engineers, and teams paying for model/tool calls or GPU workloads.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #6327 (opened 2025-11-08) reports a permanent retry loop when recurring server errors continue, requiring manual interruption rather than reaching a bounded terminal state.
2. NousResearch Hermes Agent issue #35114 (opened 2026-08-27) requests retry/fault-tolerance for long single-worker inference jobs because a transient network error can terminate hours of work and waste substantial GPU time.
3. Cursor issue #3260 (opened 2025-03-20) reports repeated `Tool Error` responses causing the agent to loop tool calls instead of terminating or changing strategy.

### Interpretation
These signals show two opposite symptoms of the same control-plane gap: retry decisions are not consistently based on normalized error semantics plus bounded episode state. Fixed retry counts and global turn limits alone cannot distinguish a recoverable transport failure from a deterministic auth/validation failure or an unchanged repeated error.

### Proposed solution
Normalize errors into explicit retryable/non-retryable classes and apply a deterministic episode budget across attempts, elapsed time, repeated fingerprint count, and observable progress. Emit only RETRY or STOP with a machine-readable reason and bounded backoff.

## Existing approaches
SDK/provider automatic retries; fixed attempt limits; exponential backoff; global turn/time limits; job restarts; manual user interruption; workflow-level exception handlers.

## Remaining limitations
- Different layers may independently retry the same failure, multiplying calls.
- Fixed counts ignore cumulative retry latency/cost and error identity.
- Global turn limits may terminate far after a retry storm has already wasted resources.
- Immediate aborts can waste expensive work on transient connection/server failures.
- Auth, validation, permission, and policy errors should normally terminate, but generic retry wrappers may not know their semantics.
- Unknown error classes are often treated inconsistently.

## Root-cause analysis
- No canonical error taxonomy at the orchestration boundary.
- Retry state is local to individual SDK/tool calls instead of a shared episode.
- Repeated-error fingerprints and observable state changes are not tracked together.
- Retry budget is often count-only rather than count + elapsed time + progress.
- Terminal states are not explicit enough for the outer agent loop.

## Improvement opportunity
Move the final retry decision to a small deterministic control-plane gate. Preserve lower-level SDK behavior where useful, but expose its attempts to the shared episode ledger so the outer agent cannot unknowingly retry forever. Benchmark recovery and wasted work before and after.

## Relevant sources
- https://github.com/openai/codex/issues/6327
- https://github.com/NousResearch/hermes-agent/issues/35114
- https://github.com/getcursor/cursor/issues/3260
