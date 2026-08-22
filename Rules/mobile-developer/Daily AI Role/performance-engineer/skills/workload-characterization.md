# Workload Characterization

## Purpose
Convert vague performance concerns into a representative workload model.

## Trigger
New benchmark, capacity review, regression investigation, or performance-sensitive design.

## Inputs
User journeys, traffic metrics, request mix, payload sizes, concurrency, datasets, dependency behavior, peak patterns, growth assumptions.

## Preconditions
Identify the system boundary and target metric.

## Procedure
1. Identify critical journeys and operations.
2. Capture arrival rate, concurrency, burstiness, request mix, payload/data distributions, cache state, and think time.
3. Separate steady-state, peak, burst, and failure-mode workloads.
4. Identify external dependencies and rate limits.
5. Define representative datasets and warm/cold states.
6. Document assumptions and gaps.
7. Produce workload profiles with measurable acceptance criteria.

## Decisions
Prefer production-derived distributions over synthetic uniform traffic when available. Create separate scenarios when one workload cannot represent materially different behaviors.

## Output
Versioned workload model and assumptions.

## Verification
Stakeholders can trace each scenario to a user/business path or operational risk.

## Failure handling
If production evidence is unavailable, label synthetic assumptions and avoid strong capacity claims.

## Stop condition
Workload dimensions are stable enough to reproduce and materially cover the target risk.