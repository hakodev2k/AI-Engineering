# Core Web Vitals Diagnostics

## Purpose
Diagnose and improve LCP, INP, and CLS using evidence from real users and browser traces rather than metric-level guesswork.

## When to use
Use when Core Web Vitals degrade, a route fails field thresholds, or a release causes user-visible responsiveness or stability regressions.

## Inputs
RUM distributions, CrUX or equivalent field data, browser performance traces, network waterfalls, DOM/layout information, deployment history.

## Context to inspect
Segment by route, device class, geography, connection, browser, authenticated state, and release version. Determine whether the field problem reproduces in controlled tests.

## Core knowledge
LCP is affected by server response, discovery, transfer, decode, render delay, and main-thread contention. INP reflects interaction processing plus presentation delay and requires attribution to event handlers and long tasks. CLS requires identifying unexpected layout shifts and their sources. Improving a proxy without fixing the dominant phase can move no user metric.

## Procedure
1. Confirm the regression statistically in field data.
2. Identify affected segments and journeys.
3. Decompose the failing metric into attributable phases.
4. Reproduce a representative slow session in browser tooling.
5. Correlate network, main-thread, rendering, and resource-priority evidence.
6. Rank causes by user impact and frequency.
7. Form one measurable hypothesis per proposed change.
8. Implement the lowest-risk high-impact fix.
9. Verify in lab before deployment.
10. Validate field improvement across at least the original affected segments.

## Decision points
Optimize server/network work when LCP delay is upstream; optimize discovery or priority when the resource starts late; optimize JS scheduling when render or interaction delay dominates. Do not trade CLS improvements for hidden accessibility or content-order regressions.

## Common failure patterns
Optimizing Lighthouse score instead of affected users; treating all LCP elements alike; removing work without measuring INP attribution; masking CLS with fixed heights that break responsive content; validating only on fast hardware.

## Verification
Compare before/after distributions, not single scores. Confirm no regression in adjacent CWV metrics, visual correctness, accessibility, or business conversion.

## Expected output
A root-cause report, prioritized remediation, trace evidence, and field-verified outcome.

## Stop conditions
Escalate when field attribution is unavailable, third-party behavior cannot be controlled, or a required architectural change exceeds the current scope.