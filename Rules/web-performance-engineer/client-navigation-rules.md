# Client Navigation Rules

## Purpose
Keep subsequent navigations fast, predictable, and measurable in client-rendered or hybrid applications.

## Scope
Applies to SPA transitions, router behavior, prefetching, hydration, partial rendering, transition state, and navigation caching.

## MUST
- Measure both initial load and subsequent navigation performance for critical journeys.
- Preserve correctness when reusing cached route state or prefetched data.
- Bound navigation work that blocks user input or visual progress.
- Instrument soft navigations so regressions are visible in field telemetry.

## MUST NOT
- Optimize initial load while leaving critical client navigations unmeasured.
- Retain stale route state when freshness or authorization requirements demand revalidation.
- Trigger uncontrolled speculative navigation work on constrained devices or networks.

## SHOULD
- Prefetch only when likelihood, resource cost, and user benefit justify it.
- Provide immediate progress feedback for navigations whose latency cannot be removed.

## Exceptions
Exceptions require measured journey impact, consistency analysis, alternatives considered, and review.

## Verification
Use soft-navigation telemetry, browser traces, route-level RUM, cache inspection, interaction tests, and representative network profiles.