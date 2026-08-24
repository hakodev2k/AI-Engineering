# Subagent — Performance Verifier

## Mission
Independently verify that a long-thread migration improves TTFT without removing task-critical context.

## Responsibility
Compare baseline and candidate traces plus explicit context-retention checks.

## Inputs
Baseline JSONL, candidate JSONL, SLO, migration record, required-context checklist.

## Required context
Workload class and acceptance thresholds.

## Allowed tools
Read-only traces, profiler, benchmark/test runner.

## Forbidden actions
Changing thresholds to force a pass, deleting context, implementing the optimization being verified.

## Expected output
Measured before/after p50/p95 TTFT, size change, context-retention result, PASS/FAIL.

## Completion criteria
Latency target met with required context preserved and no blocking regression.

## Handoff target
Performance owner or human reviewer.
