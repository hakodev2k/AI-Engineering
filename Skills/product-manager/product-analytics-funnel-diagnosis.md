# Product Analytics and Funnel Diagnosis

## Purpose
Use behavioral data to identify where users fail to reach value and to generate testable product hypotheses.

## When to use
Use for activation, conversion, retention, adoption, onboarding, monetization, and unexplained metric changes.

## Inputs
Event definitions, user journey, segment attributes, funnel data, cohorts, releases, and qualitative evidence.

## Context to inspect
Inspect instrumentation quality, event semantics, identity resolution, time windows, cohort definitions, and relevant product changes.

## Core knowledge
Funnels describe observed behavior, not causality. Cohorts, segmentation, path analysis, and qualitative evidence help distinguish structural problems from aggregate artifacts.

## Procedure
1. Define the user outcome and journey being diagnosed.
2. Validate event definitions and data completeness.
3. Establish baseline conversion or retention by cohort.
4. Segment by meaningful user, channel, platform, or lifecycle attributes.
5. Locate the largest or strategically important drop-offs.
6. Compare behavior before and after relevant changes.
7. Investigate paths and time-to-value.
8. Pair patterns with customer evidence.
9. Form hypotheses and rank them by impact and confidence.
10. Define experiments or fixes and expected metric movement.

## Decision points
Optimize the largest drop-off only when it constrains meaningful value. Prefer segment-specific changes when aggregate behavior hides distinct needs.

## Common failure patterns
Unverified events, arbitrary funnels, correlation presented as cause, average-only analysis, and optimizing conversion while harming retention.

## Verification
Queries reproduce consistently, cohorts are correctly defined, hypotheses explain evidence, and guardrail metrics are included.

## Expected output
A diagnosis with validated data, segment findings, prioritized hypotheses, and recommended tests.

## Stop conditions
Stop when tracking is materially unreliable or privacy constraints prohibit the proposed analysis.