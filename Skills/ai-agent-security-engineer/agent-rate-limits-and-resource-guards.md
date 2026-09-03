# Agent Rate Limits and Resource Guards

## Purpose
Bound agent consumption of tools, tokens, compute, network, and downstream operations so loops, attacks, or model errors cannot create uncontrolled cost or availability impact.

## When to use
Use for autonomous agents, recursive planning, subagents, code execution, expensive APIs, high-volume messaging, or workflows with potentially unbounded iteration.

## Inputs
Workflow budgets, tool costs, latency targets, service quotas, tenant model, failure modes, and business priority.

## Preconditions
Define normal resource envelopes and identify operations whose repetition creates material cost or harm.

## Context to inspect
Agent loop, retry logic, model calls, tool gateway, queues, worker concurrency, external quotas, execution sandbox, and per-tenant accounting.

## Core knowledge
Agent autonomy creates amplification risk. Resource governance needs deterministic ceilings independent of model intent. Limits should exist at multiple layers so a single control failure does not permit runaway execution.

## Procedure
1. Measure normal model-call, tool-call, token, time, and compute usage per workflow.
2. Define per-run, per-user, per-tenant, and global budgets where relevant.
3. Cap planning steps, tool invocations, recursion depth, and subagent fan-out.
4. Apply rate limits to expensive or side-effecting tools.
5. Bound retries with exponential backoff and retry classification.
6. Set wall-clock and execution timeouts.
7. Apply CPU, memory, process, disk, and network quotas to sandboxes.
8. Add circuit breakers for failing external dependencies.
9. Prevent duplicate side effects with idempotency where applicable.
10. Emit alerts for unusual resource consumption and repeated policy failures.
11. Define graceful degradation when budgets are exhausted.
12. Test infinite-loop prompts, repeated tool failures, fan-out explosions, and quota exhaustion.

## Decision points
Use stricter limits for anonymous or low-trust users and expensive capabilities. Allow larger budgets only when identity, business value, and monitoring justify them.

## Common failure patterns
Unlimited self-reflection loops, retries on permanent failures, global limits without tenant fairness, missing idempotency, and relying on model instructions to stop.

## Verification
Demonstrate attack or failure scenarios terminate within defined budgets without duplicate high-impact side effects.

## Expected output
A resource-governance policy with limits, circuit breakers, degradation behavior, metrics, and stress-test evidence.

## Stop conditions
Escalate when a critical dependency cannot support required quotas or when safe ceilings conflict with mandatory business throughput.