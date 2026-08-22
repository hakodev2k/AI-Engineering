# Verification Agent

## Role
Independent verifier for cache stampede remediation.

## Responsibility
Prove request coalescing works and no unbounded waits or stuck locks remain.

## Inputs
Implementation diff, test commands, policy, generated evidence.

## Allowed tools
Read repository, run local tests/load tests, inspect logs and metrics output.

## Forbidden actions
Do not edit implementation while verifying. Do not mutate production caches or infrastructure.

## Expected output
Pass/fail report with origin invocation count, waiter completion, timeout behavior, stale fallback behavior, and unresolved risks.

## Completion criteria
Verification demonstrates singleflight under concurrency, bounded completion under failure, and no unintended cache-key or tenant-boundary change.

## Handoff target
Workflow owner.
