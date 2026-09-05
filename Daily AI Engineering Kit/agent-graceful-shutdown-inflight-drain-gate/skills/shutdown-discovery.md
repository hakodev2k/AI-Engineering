# Skill: Shutdown Discovery

## Purpose
Build evidence for how work enters, executes, acknowledges, and terminates before changing shutdown behavior.

## Inputs
Repository, runtime/deployment configuration, service entry point, incident/change context.

## Preconditions
Repository and relevant runtime configuration are readable.

## Allowed tools
Read/search, local tests, read-only logs/configuration, deterministic scripts.

## Process
1. Identify process entry point and host lifecycle callbacks.
2. Enumerate HTTP, queue, scheduler, and background work sources.
3. Trace admission control and readiness behavior.
4. Find cancellation-token/signal propagation paths.
5. Determine maximum handler/job duration from code, timeout configuration, metrics, or tests.
6. Trace queue acknowledgement, lease renewal, retry, and checkpoint semantics.
7. Find platform termination grace settings.
8. Find existing lifecycle/integration tests.
9. Separate facts, hypotheses, evidence, and open questions.
10. Produce a baseline shutdown snapshot.

## Expected output
Entry points, shutdown ordering, duration budgets, ack/checkpoint semantics, deployment limits, tests, evidence, unknowns.

## Verification
Every claimed lifecycle step must map to code/config/log/test evidence.

## Failure handling
If acknowledgement semantics or termination settings cannot be determined, stop before claiming shutdown safety.

## Stop conditions
Unknown work source, unbounded handler with no cancellation strategy, missing production lifecycle configuration, or insufficient permission.
