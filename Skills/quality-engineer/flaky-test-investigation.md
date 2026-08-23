# Flaky Test Investigation

## Purpose
Diagnose and remove nondeterministic tests without hiding real product defects.

## When to use
Use when identical code intermittently passes and fails or CI reliability degrades.

## Inputs
Failure logs, traces, screenshots, test code, timing, environment data, run history.

## Context to inspect
Inspect concurrency, shared state, clocks, random values, network dependencies, asynchronous waits, resource limits, ordering, and cleanup.

## Core knowledge
Flakiness is a defect in either product, test, environment, or their interaction. Retries may collect evidence but are not a fix.

## Procedure
1. Quantify failure frequency and patterns.
2. Preserve artifacts from passing and failing runs.
3. Reproduce under controlled repetition.
4. Vary parallelism, timing, order, and resource pressure.
5. Identify the nondeterministic dependency.
6. Determine whether behavior exposes a product race or test defect.
7. Fix root cause with deterministic synchronization/state.
8. Remove diagnostic retries or quarantine.
9. Stress-run the fix and monitor recurrence.

## Decision points
Quarantine only when continued execution blocks delivery and ownership plus expiry are recorded.

## Common failure patterns
Adding sleeps, unlimited retries, weakening assertions, blaming CI without evidence, and deleting valuable tests.

## Verification
Run enough repetitions to establish materially improved reliability and confirm the assertion still detects the intended failure.

## Expected output
Root-cause evidence, fix, and measured post-fix stability.

## Stop conditions
Escalate when failure depends on inaccessible infrastructure or indicates a high-risk production race.