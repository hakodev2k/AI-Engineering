# Online Routing Experimentation

## Purpose
Validate routing changes with controlled production experiments while limiting user, cost, safety, and reliability risk.

## When to use
Use after offline evaluation when a routing policy, threshold, model, or cascade requires real-traffic validation.

## Inputs
Baseline policy, candidate policy, experiment population, guardrails, primary metrics, exposure plan, rollback mechanism.

## Context to inspect
Traffic allocation infrastructure, sticky assignment, tenant constraints, model quotas, incident controls, business seasonality, and concurrent experiments.

## Core knowledge
Router experiments can change both model mix and system load. Randomization must respect user or session dependence. Primary metrics need enough sensitivity to distinguish quality improvements from cost shifts, while guardrails protect safety, latency, error rate, and spend.

## Procedure
1. State hypothesis and minimum worthwhile effect.
2. Define eligible population and exclusion rules.
3. Choose randomization unit to avoid contamination.
4. Define primary, secondary, and guardrail metrics.
5. Validate telemetry and assignment before exposure.
6. Start with a small canary or shadow phase.
7. Increase exposure only while guardrails hold.
8. Analyze results by key traffic segments.
9. Check novelty, provider incidents, and concurrent-change confounders.
10. Decide promote, revise, or rollback using predeclared criteria.

## Decision points
Use shadowing when outputs can be generated without affecting users; A/B testing when user outcomes matter; interleaving or paired methods only when the metric design supports them.

## Common failure patterns
Request-level randomization for conversational users, peeking without correction, ignoring quota effects, changing the policy mid-test, and optimizing a proxy that harms task success.

## Verification
Verify assignment integrity, telemetry completeness, statistical analysis, guardrail compliance, and reproducible experiment configuration.

## Expected output
An experiment decision with measured effect sizes, uncertainty, segment analysis, and rollout recommendation.

## Stop conditions
Stop exposure immediately when a safety, privacy, reliability, or spend guardrail is breached.