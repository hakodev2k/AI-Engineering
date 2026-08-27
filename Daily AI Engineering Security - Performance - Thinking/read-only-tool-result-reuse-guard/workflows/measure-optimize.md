# Workflow: Measure, Optimize, Verify Tool Reuse

## Trigger
Duplicate read-only calls, tool-latency regression, external API cost growth, or repeated tool outputs in context.

## Goal
Reduce redundant external tool execution while preserving freshness, scope isolation, and task correctness.

## Inputs
Representative trace, policy, tool side-effect classification, freshness requirements, task-quality checks.

## Baseline
Record total tool calls, duplicate candidates, tool latency, repeated-output token volume where available, and task success.

## Context
Only the target tool, its declared semantics, and representative workload are required.

## Stages
1. **Observe:** identify repeated read-only calls.
2. **Measure baseline:** run `tool_reuse_profiler.py`.
3. **Diagnose:** inspect canonical argument identity, scope, TTL, and output digests.
4. **Form hypothesis:** select one safe tool and reuse policy.
5. **Implement:** enable run-scoped reuse for that tool only.
6. **Measure again:** replay the same workload.
7. **Improved?** If no, adjust TTL or disable candidate. Maximum 2 attempts.
8. **Verify:** independent Performance Verifier checks safety and before/after metrics.

## Responsible agent
Implementation owner handles stages 1–7. Performance Verifier handles stage 8.

## Tools
Profiler script, unit tests, trace collector, latency metrics, representative task suite.

## Outputs
Baseline report, candidate decision, before/after comparison, verification result.

## Checkpoints
After baseline, before enabling reuse, after each replay, before release.

## Metrics
Duplicate-call rate, calls saved, avoidable latency, cache hit rate, stale-result failures, task success, repeated-output token volume.

## Retry policy
Maximum two tuning attempts. Never retry by widening cache scope without a separate security review.

## Stop conditions
Side-effect ambiguity, stale-result correctness failure, scope leakage risk, missing baseline, or two unsuccessful attempts.

## Failure path
Disable reuse for the tool and restore live execution.

## Verification
Verifier reproduces the profiler output and confirms that changed-state fixtures bypass reuse.

## Definition of Done
Same-workload external calls or latency improve, tests pass, no stale-result failure occurs, and no side-effecting tool is cached.
