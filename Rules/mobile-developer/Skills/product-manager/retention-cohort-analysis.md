# Retention and Cohort Analysis

## Purpose
Understand whether users continue receiving product value and identify behaviors, segments, or product conditions associated with durable retention.

## When to use
Use when growth masks churn, engagement weakens, product-market fit is uncertain, or lifecycle improvements are being prioritized.

## Inputs
User activity, value events, signup or activation dates, segments, subscription state, churn reasons, and release history.

## Context to inspect
Inspect what meaningful return behavior means for the product, natural usage frequency, seasonality, reactivation, and account versus user identity.

## Core knowledge
Retention should be defined around recurring value, not arbitrary login activity. Cohort curves expose changes hidden by aggregate active-user metrics.

## Procedure
1. Define the retained behavior and expected usage interval.
2. Build acquisition or activation cohorts.
3. Calculate retention across appropriate periods.
4. Segment by source, persona, plan, platform, and activation behavior.
5. Identify flattening, decay, and cohort shifts.
6. Compare retained and churned users without assuming causality.
7. Combine findings with churn interviews or support evidence.
8. Identify candidate activation or ongoing-value interventions.
9. Define expected cohort improvement and guardrails.

## Decision points
Use logo/account retention for account products and user retention for individual behavior. Use revenue retention when expansion and contraction materially affect economics.

## Common failure patterns
Using login as value, mixing cohorts, ignoring censoring, optimizing short-term engagement, and attributing retention to correlated behaviors without testing.

## Verification
Definitions match product usage cadence; cohorts reconcile with source data; segment differences are statistically and practically meaningful.

## Expected output
Retention curves, segment diagnosis, hypotheses, and prioritized interventions.

## Stop conditions
Stop when identity or activity data cannot support reliable cohorts or when retention definition lacks a meaningful customer-value event.