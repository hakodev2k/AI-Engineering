# Production Canary and Shadow Testing

## Purpose
Validate AI changes against realistic production traffic while limiting user impact through shadow execution, canaries, controlled cohorts, and explicit rollback gates.

## When to use
Use after offline evaluation passes but before broad rollout of model, prompt, retrieval, routing, agent, or safety changes.

## Inputs
Candidate and baseline configurations, production traffic definition, telemetry, rollout controls, evaluation metrics, privacy constraints, and rollback thresholds.

## Preconditions
Offline release gates pass, observability is adequate, and rollout/rollback controls are proven.

## Context to inspect
Inspect traffic routing, experiment assignment, model version tags, logs, online evaluators, user-impact metrics, costs, rate limits, and incident procedures.

## Core knowledge
Offline suites cannot reproduce all production distributions. Shadow testing observes candidate behavior without serving it; canaries expose a limited cohort. Both require clean attribution and guardrails against hidden side effects.

## Procedure
1. Define online success, guardrail, and rollback metrics.
2. Verify model/prompt/config version tags in telemetry.
3. Run shadow traffic where side effects can be suppressed.
4. Compare baseline and candidate on matched production inputs.
5. Inspect quality, safety, latency, cost, and error-rate deltas.
6. Review rare and high-severity candidate failures.
7. Start a small canary only after shadow evidence is acceptable.
8. Monitor cohort-specific metrics and operational saturation.
9. Expand gradually only when gates remain healthy.
10. Roll back immediately when predefined severe thresholds are crossed.
11. Add production-discovered failures to offline regression suites.

## Decision points
Prefer shadow mode for high-risk or tool-using changes. Use canaries only when side effects, privacy, and experiment attribution are controlled. Do not expand based on average quality if safety or reliability guardrails regress.

## Common failure patterns
Unversioned telemetry, candidate side effects during shadowing, cohort contamination, missing rollback criteria, and broad rollout after too-short observation.

## Verification
Confirm traffic attribution is correct, guardrails are monitored, rollback works, and online results agree with the release decision.

## Expected output
A production validation report with shadow/canary evidence, observed regressions, rollout state, and rollback criteria.

## Stop conditions
Stop or roll back when severe safety, privacy, authorization, reliability, or SLO thresholds are breached.