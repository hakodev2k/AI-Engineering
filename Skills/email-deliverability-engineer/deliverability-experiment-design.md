# Deliverability Experiment Design

## Purpose
Run controlled experiments that distinguish real deliverability effects from changes in audience, provider mix, seasonality, or random variation.

## When to use
Use to evaluate infrastructure, segmentation, cadence, template, link-domain, or routing changes when production evidence is needed. Do not experiment with unsafe consent or authentication practices.

## Inputs
Hypothesis, target population, baseline metrics, provider mix, message class, expected effect, traffic constraints, and risk/rollback limits.

## Preconditions
Define the primary outcome and guardrail metrics before sending. Ensure test recipients are legitimately eligible.

## Context to inspect
Inspect assignment method, cohort comparability, mailbox-provider distribution, sample size, concurrent campaigns, warm-up state, reputation spillover, and event-measurement quality.

## Core knowledge
Deliverability experiments can violate independence because domain/IP reputation is shared across groups. Opens are noisy; use stronger outcomes such as provider responses, complaints, downstream engagement, and representative placement signals. Large infrastructure changes may need staged quasi-experiments rather than naive A/B tests.

## Procedure
1. State one falsifiable hypothesis and expected mechanism.
2. Choose the smallest safe change that isolates the variable.
3. Define primary metric, guardrails, observation window, and rollback threshold.
4. Randomize or match cohorts while preserving provider distribution where feasible.
5. Keep identities, cadence, and unrelated content stable.
6. Record all concurrent operational changes.
7. Run at sufficient but safe volume.
8. Analyze by mailbox provider and cohort, not only globally.
9. Check complaints, bounces, and reputation for adverse effects.
10. Repeat or extend observation before claiming durable effects.
11. Document result, limitations, and deployment decision.

## Decision points
Use randomized tests for recipient-level changes; use staged time/provider comparisons for shared infrastructure changes. Stop early for safety guardrail breaches, not merely because interim results look favorable.

## Common failure patterns
Changing multiple variables, using opens as the sole outcome, unequal provider mix, underpowered samples, ignoring shared-reputation interference, and declaring causality from before/after charts.

## Verification
Confirm assignment integrity, event completeness, comparable cohorts, guardrail safety, and statistically/operationally meaningful effects across relevant providers.

## Expected output
An experiment record containing hypothesis, design, results, limitations, and an evidence-backed decision.

## Stop conditions
Stop when complaint/bounce guardrails breach, telemetry becomes unreliable, or the experiment risks sender reputation or recipient trust.