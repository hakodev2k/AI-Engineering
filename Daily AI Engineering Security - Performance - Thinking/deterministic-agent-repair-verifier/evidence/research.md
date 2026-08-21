# Research — Deterministic Agent Repair Verifier

## Topic
Deterministic Agent Repair Verifier

## Category
Thinking

## Problem
Agents often respond to failed tool calls, stale instructions, or rejected outputs with poorly bounded retries. They may loop, retry the same invalid action, silently hang, or accept unsupported success. Using another LLM as a judge on every step adds cost and still does not guarantee that deterministic task requirements were actually satisfied.

## Why it matters now
Recent agent-runtime issues and 2026 research show that failure recovery remains fragile while deterministic checks can catch large classes of failures cheaply. Structured repair feedback also materially improves retry success compared with vague diagnostics.

## Affected users
Developers building coding agents, autonomous tool users, multi-agent workflows, production support agents, CI agents, and long-running task orchestrators.

## Current public evidence
### Observed evidence
1. Hermes Agent issue #69131 (2026-07) reports a conversation loop silently hanging after a tool-call error: no retry, exception, or user feedback until a later gateway timeout: https://github.com/NousResearch/hermes-agent/issues/69131
2. Hermes Agent issue #53361 (2026-06-27) reports an instruction-reality mismatch where an already-satisfied task can trigger 40+ minutes of redundant reasoning/tool activity because the runtime lacks a reliable goal-state termination check: https://github.com/NousResearch/hermes-agent/issues/53361
3. `Real-Time Detection and Repair of LLM Agent Failures` (2026-08-03) reports deterministic verification catching 60% of failures, 96% with a coverage check, with zero false positives in the reported evaluation, while rollback-and-rerun improved task success from 52% to 73%: https://arxiv.org/abs/2608.02464
4. `Structured Feedback Improves Repair in an LLM Agent Loop` (2026-07-15) reports large gains when rejected attempts receive structured feedback containing failure location, observed value, and admissible alternatives rather than raw diagnostics: https://arxiv.org/abs/2607.14167

## Existing approaches
- Retry the same model call after a tool error.
- Ask a second LLM to judge every intermediate step.
- Stop after a fixed iteration count.
- Forward raw tool/test errors back to the model.
- Trust an agent's textual completion claim when no exception occurred.

## Remaining limitations
Fixed retry counts do not distinguish progress from repetition. LLM judges add latency and cost and can share the same blind spots as the implementing model. Raw diagnostics frequently omit the exact failed requirement and allowed repair space. Success messages can be unsupported when required calls/tests were skipped.

## Root-cause analysis
- Goal state is not represented as machine-checkable acceptance predicates.
- Tool errors are treated as text rather than typed failure evidence.
- Retry loops lack progress fingerprints and stop conditions.
- Required action coverage is not checked before success.
- Repair feedback is unstructured and does not identify admissible next actions.
- The implementing agent is often its own verifier.

## Improvement opportunity
Create a deterministic repair envelope around the agent loop. Express observable acceptance predicates and required-call coverage, fingerprint failed attempts, classify failures, generate structured repair feedback, and permit only bounded retries that demonstrate new evidence or a changed hypothesis. Verify final success independently using tool/test evidence rather than prose claims.

## Goal
Reduce hangs, duplicate retries, unsupported success claims, and expensive judge calls while improving recoverability from real tool/test failures.

## Metrics
- Unsupported success claims blocked.
- Required-call coverage.
- Deterministic predicate pass rate.
- Duplicate-attempt rate.
- Mean repair attempts per failure.
- Recovery success rate.
- LLM judge calls avoided.
- Time/token cost per repaired task.

## Trigger
A tool error, failed test/validator, contradictory environment observation, repeated action fingerprint, or agent completion claim.

## Inputs
Task goal, acceptance predicates, required calls, tool/test events, attempt fingerprints, retry budget, and latest failure evidence.

## Outputs
Verified/repair/stop decision, failed predicate IDs, missing required calls, duplicate-attempt evidence, structured repair feedback, and final verification record.

## Interpretation
The cited studies do not establish that deterministic verification replaces all semantic review. They show that many agent failures are observable through task-specific checks and that structured repair signals can materially improve bounded retries.

## Proposed solution
A reusable deterministic verifier plus repair workflow that separates implementation from verification, checks goal-state predicates and action coverage, detects repeated attempts, emits structured failure feedback, and stops after a bounded retry budget.