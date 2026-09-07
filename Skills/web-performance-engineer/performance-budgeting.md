# Performance Budgeting

## Purpose
Define measurable web-performance constraints that convert user experience and business goals into enforceable engineering limits.

## When to use
Use when starting a product, setting release gates, recovering from performance drift, or aligning teams on acceptable latency, asset size, and runtime cost.

## Inputs
User journeys, device/network mix, RUM data, business KPIs, architecture, build artifacts, current Core Web Vitals, release process.

## Context to inspect
Identify critical journeys, traffic percentiles, target geographies, supported browsers/devices, CDN behavior, third-party dependencies, and existing CI checks. Do not assume lab metrics represent production users.

## Core knowledge
Budgets should be user-centric and percentile-based. Useful dimensions include LCP, INP, CLS, TTFB, total JS/CSS/image bytes, request count, long-task time, hydration cost, and route-transition latency. A budget without ownership and enforcement becomes documentation only.

## Procedure
1. Rank user journeys by traffic and business impact.
2. Establish production baselines from representative RUM percentiles.
3. Define target user outcomes and map them to technical indicators.
4. Set absolute budgets and regression thresholds separately.
5. Segment budgets where device or network constraints materially differ.
6. Allocate shared budgets across application code, platform code, and third parties.
7. Add CI or release checks for metrics measurable before production.
8. Add RUM alerts for production-only regressions.
9. Assign owners and exception-expiry dates.
10. Revisit budgets after architecture or audience changes.

## Decision points
Prefer percentile targets over averages. Use hard gates for deterministic asset-size regressions; use trend-based gates for noisy lab metrics. Allow temporary exceptions only when quantified business value outweighs user cost.

## Common failure patterns
Budgets based on desktop-only tests; one global number for all journeys; thresholds too loose to influence design; blocking releases on noisy single runs; ignoring third-party growth; permanent exceptions.

## Verification
Confirm budgets map to named journeys, have baselines and owners, are enforced in CI/RUM, and generate actionable failures with enough diagnostic context.

## Expected output
A versioned performance-budget specification plus automated gates and exception policy.

## Stop conditions
Escalate when required user segments cannot be measured, business goals conflict with feasible budgets, or enforcement would block a critical release without an approved exception process.