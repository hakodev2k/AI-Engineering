# Workflow — Measure, Optimize, Verify Resume

## Trigger
Session resume, cap interruption recovery, context handoff, or resume-cost regression.

## Goal
Reduce rehydration tokens and rediscovery calls without losing critical state or result quality.

## Inputs
Candidate context items, budget policy, full-context reference fixture, provider usage/cache telemetry when available.

## Baseline
Resume once with the safe full-context fixture and record input tokens, cache creation/read tokens, latency, rediscovery calls, acceptance-test result, and critical-field coverage.

## Context
Use `rules/resume-context-budget.md`, `skills/build-safe-resume-bundle.md`, and `config/budget.json`.

## Stages
1. **Observe** — inventory startup instructions, history, memory, handoff data, and tool-derived facts.
2. **Measure baseline** — capture full-context token/call/quality metrics.
3. **Diagnose** — identify duplicates, stale tool facts, low-relevance history, cache-expiry amplification.
4. **Form hypothesis** — define what can be deduplicated or lazy-loaded without correctness loss.
5. **Optimize** — build a minimal safe bundle and lazy-load manifest.
6. **Measure again** — execute the same fixture and collect token/call/quality metrics.
7. **Improved?** — if not, replan once per changed hypothesis, maximum 2 replans.
8. **Independent verification** — Resume Verification Agent compares optimized vs reference.
9. **Complete** — publish verified bundle/policy or revert to full safe context.

## Responsible agent
Context implementer stages 1–7; `subagents/resume-verification-agent.md` stage 8.

## Tools
`scripts/resume_budget.py`, provider tokenizer/usage telemetry, deterministic hashes, task acceptance tests.

## Outputs
Baseline, optimized bundle, lazy manifest, before/after metrics, independent verification decision.

## Checkpoints
After baseline, after bundle generation, after optimized run, before adoption.

## Metrics
Input tokens/resume, cache creation/read tokens, latency, duplicate estimate, rediscovery calls, critical recall, quality regression rate.

## Retry policy
Maximum 2 replans. Every retry must identify a specific missing/overincluded context class. No identical retries.

## Stop conditions
Critical recall below 100%, quality regression above tolerance, stale high-impact state, token estimate cannot fit critical content, or retries exhausted.

## Failure path
Restore full safe context or switch to a larger context capacity. Escalate context design issue; do not truncate critical fields.

## Verification
Independent verifier must confirm acceptance-test parity and all critical fields before savings are claimed.

## Definition of Done
Baseline measured; duplicates/staleness documented; optimized bundle generated; actual or best-available token metrics captured; target token/call reduction measured; critical recall 100%; reference quality preserved; independent verification passes.
