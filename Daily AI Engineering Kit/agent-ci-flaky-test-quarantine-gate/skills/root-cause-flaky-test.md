# Skill: Root Cause Flaky Test

## Purpose
Find and validate the mechanism causing nondeterministic test outcomes.

## Process
1. Identify test entry point, fixtures, shared state, clocks, random sources, network/filesystem/database dependencies, and parallel execution.
2. Inspect nearby tests for order coupling and shared mutable resources.
3. Form one hypothesis at a time: timing race, leaked state, random seed, eventual consistency, port/file collision, environment dependency, external service, resource starvation, or test-framework misuse.
4. Design the smallest experiment that can falsify each hypothesis.
5. Preserve command, seed, environment, logs, and run IDs.
6. Implement the smallest safe fix only after a hypothesis is supported.
7. Run repeated targeted verification plus normal suite verification.
8. Allow at most two test-fix-retest cycles before escalation.

## Expected output
Confirmed cause or bounded unresolved hypotheses, evidence, fix, verification results, residual risk.

## Stop conditions
Production mutation required, destructive database action, secret/security change, or retries exhausted.
