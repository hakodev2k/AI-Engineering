# Incident Reproduction and Chaos Testing

## Purpose
Reproduce incident conditions safely and use controlled fault injection to verify resilience against recurrence.

## When to use
Use after containment to validate hypotheses, fallback behavior, circuit breakers, tool constraints, provider failure handling, and safe modes.

## Inputs
Incident traces, architecture, fault hypotheses, staging/sandbox environment, synthetic data, success criteria.

## Preconditions
Testing environment is isolated from real side effects and sensitive production data unless explicitly approved.

## Context to inspect
Provider simulators, feature flags, traffic replay, tool mocks, safety gates, queues, retries, observability.

## Core knowledge
AI incident reproduction must fix model/config versions where possible and account for stochasticity using repeated trials. Chaos tests should target control effectiveness, not create uncontrolled damage.

## Procedure
1. Define the incident hypothesis and observable failure.
2. Build the smallest safe reproduction.
3. Pin model, prompt, retrieval, and tool versions.
4. Replay representative inputs multiple times.
5. Inject the suspected dependency or configuration fault.
6. Observe detection and containment controls.
7. Apply remediation.
8. Repeat the same test and adjacent variants.
9. Measure recovery time and residual failure rate.
10. Add the scenario to regression/chaos suites.

## Decision points
Use deterministic mocks for control-path validation and real providers/models when stochastic behavior is itself under test.

## Common failure patterns
Testing only once, touching production side effects, changing many variables simultaneously, and proving the fix without testing detection.

## Verification
The pre-fix scenario reproduces at expected rate and the post-fix scenario is bounded by validated controls.

## Expected output
Reproduction harness, fault scenario, measured results, and regression test.

## Stop conditions
Stop when the test could affect production, regulated data, external users, or irreversible actions without approval.