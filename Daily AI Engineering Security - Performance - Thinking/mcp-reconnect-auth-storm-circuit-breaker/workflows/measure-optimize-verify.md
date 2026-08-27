# Workflow: Measure, Optimize, Verify Reconnect Churn

## Trigger
Repeated MCP reconnect/auth/discovery events, first-response latency spikes, schema reinjection, 429s, or timeouts.

## Goal
Reduce redundant connection-maintenance work while preserving task success and security.

## Inputs
Timestamped trace events, workload definition, policy, current retry/cache/auth configuration.

## Baseline
Run the same representative workload at least three times when feasible. Capture connects/session, OAuth starts/session, tool-list refreshes/session, schema reinjection tokens/session, useful tool calls, p50/p95 first-response latency, 429/timeouts, and task success.

## Stages
1. **Observe:** correlate repeated connect/auth/discovery work by normalized key.
2. **Measure baseline:** run `scripts/reconnect_budget_guard.py` and benchmark workload.
3. **Diagnose:** determine whether churn originates in retry layering, missing single-flight, cache invalidation, reconnect handling, or true upstream failure.
4. **Hypothesize:** choose one mechanism and a measurable expected effect.
5. **Optimize:** implement single-flight, bounded retry budget, catalog reuse, or lazy connection as appropriate.
6. **Measure again:** repeat the identical workload and collect the same metrics.
7. **Improved?** If no, re-evaluate with new evidence; maximum 2 optimization revisions.
8. **Verify:** independent Performance Verifier reproduces results and checks security controls.

## Responsible agent
Performance investigator/implementation owner through stage 7; `subagents/performance-verifier.md` at stage 8.

## Tools
Trace/log parser, guard script, unit tests, repeatable benchmark harness.

## Outputs
Baseline dataset, diagnosis, hypothesis, implementation, post-change metrics, independent verification decision.

## Checkpoints
After baseline, before changing retries/auth, after each optimization, before completion.

## Metrics
Connect/OAuth/tools-list counts, useful-tool-calls per connect, schema reinjection tokens, first-response p50/p95, 429/timeouts, total task latency, task success rate.

## Retry policy
Maximum 2 optimization revisions. Do not increase retries as a default response to retry storms.

## Stop conditions
Authentication/security regression, task-success regression, insufficient evidence, or exhausted retries.

## Failure path
Rollback to previous verified behavior; apply cooldown; expose upstream error and supporting trace rather than retrying indefinitely.

## Verification
Independent verifier must reproduce before/after results using the same workload.

## Definition of Done
Implemented optimization, measured reduction in redundant work/latency/token overhead, task success preserved, tests pass, security controls preserved, independent verification complete.
