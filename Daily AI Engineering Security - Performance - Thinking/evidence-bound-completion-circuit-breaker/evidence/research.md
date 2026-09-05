# Research

## Topic
Evidence-Bound Completion Circuit Breaker

## Category
Thinking

## Problem
Agents can promote partial, stale, or component evidence into a target-level completion claim and may continue long loops without an evidence-progress stop condition.

## Why it matters now
### Observed evidence
1. OpenAI Codex issue #42080, opened 2026-09-01, reports several long tool-heavy tasks where component tests, process health, mocked publishers, snapshots, or evidence from another execution were presented as if the user-facing target worked. The reporter requests evidence-bound readiness and circuit breakers.
2. Hermes Agent issue #58196 (2026-07-04) describes agents saying “done/fixed/works” without a verification check and proposes verify-before-claim guidance plus a detector.
3. Hermes Agent issue #89182 (2026-08-18) notes its verification evidence ledger is passive and proposes a gate so a coding turn cannot claim verified without fresh passing evidence or a concrete blocker.

## Affected users
Developers delegating long repository tasks; engineering teams using autonomous coding agents; platform builders implementing agent runtimes and approval/release workflows.

## Existing approaches
Tests, verifier prompts, passive evidence ledgers, max-turn limits, timeout budgets, human review, final-answer heuristics.

## Remaining limitations
Passing local checks may not satisfy target acceptance; evidence freshness/scope is not always encoded; passive ledgers do not block output; max-turn limits stop late but do not require progress toward acceptance; the implementing agent may self-verify.

## Root-cause analysis
- Acceptance criteria are natural-language only and not bound to evidence IDs.
- Readiness states are collapsed into a single “done”.
- Evidence lacks target, timestamp, outcome, and provenance fields.
- Stop conditions count activity rather than acceptance progress.
- Completion rendering can run independently from verification state.

## Improvement opportunity
Represent acceptance as an executable contract, require fresh evidence per readiness transition, and trip a bounded circuit breaker when target evidence does not advance.

## Proposed solution
A deterministic readiness guard plus procedures for contract definition, independent verification, and bounded recovery. It uses observable evidence metadata only and never requests hidden chain-of-thought.

## Relevant sources
- https://github.com/openai/codex/issues/42080
- https://github.com/NousResearch/hermes-agent/issues/58196
- https://github.com/NousResearch/hermes-agent/issues/89182
- https://github.com/openai/codex/issues/42693
