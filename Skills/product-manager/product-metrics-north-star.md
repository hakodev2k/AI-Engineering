# Product Metrics and North Star Design

## Purpose
Design a measurement system that connects customer value, business outcomes, product behavior, and guardrails.

## When to use
Use when defining product success, diagnosing performance, aligning teams, or replacing vanity metrics.

## Inputs
Product strategy, value proposition, business model, user journey, telemetry capabilities, and current metric baselines.

## Context to inspect
Inspect acquisition, activation, engagement, retention, monetization, quality, support, and operational signals relevant to the product.

## Core knowledge
A useful North Star reflects recurring customer value and should connect causally to durable business value. It needs input metrics and guardrails to prevent gaming.

## Procedure
1. Define the core value users repeatedly receive.
2. Map behaviors that demonstrate that value.
3. Identify business mechanisms connected to those behaviors.
4. Propose candidate North Star metrics.
5. Test sensitivity, controllability, lag, segment bias, and gaming risk.
6. Define input metrics teams can influence.
7. Add guardrails for quality, safety, cost, or customer harm.
8. Specify formulas, owners, sources, and reporting cadence.
9. Validate historical behavior where data exists.

## Decision points
Use a metric tree when one number hides multiple mechanisms. Prefer cohort or segment metrics when aggregates mask product health.

## Common failure patterns
Choosing revenue as the only product metric, optimizing clicks without value, changing definitions silently, and measuring outputs instead of outcomes.

## Verification
Metric definitions are reproducible; source data is trustworthy; movement can be explained through input metrics; guardrails expose harmful optimization.

## Expected output
A metric tree with North Star or primary outcomes, inputs, guardrails, definitions, owners, and interpretation guidance.

## Stop conditions
Escalate when required telemetry is unreliable, the value proposition is unresolved, or incentives would create material customer harm.