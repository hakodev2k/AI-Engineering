# Performance and Bundle Rules

## Purpose
Protect startup, interaction, network, and memory performance with measurable budgets and evidence.

## Scope
Bundles, lazy loading, assets, dependencies, rendering, memory, network requests, and Core Web Vitals where applicable.

## MUST
- Measure meaningful performance changes before and after optimization under comparable conditions.
- Review dependency additions for bundle/runtime cost and actual usage.
- Define budgets or thresholds for critical user journeys where performance is a product requirement.
- Investigate memory leaks and retained subscriptions/resources with runtime evidence.

## MUST NOT
- Add large dependencies for trivial capabilities without trade-off review.
- Optimize synthetic microbenchmarks while worsening critical user experience.
- Claim a performance win from code inspection alone.

## SHOULD
- Use route-level code splitting, asset optimization, caching, and deferred work when evidence shows benefit.

## Exceptions
A temporary budget regression requires owner, reason, quantified impact, approval, and recovery plan.

## Verification
Inspect build stats, bundle analysis, Lighthouse/browser traces, Web Vitals, network waterfalls, memory profiles, and before/after measurements.