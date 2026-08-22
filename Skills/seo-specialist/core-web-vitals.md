# Core Web Vitals Optimization

## Purpose
Improve real-user loading, responsiveness, and visual stability while protecting product behavior and conversion.

## When to use
Use when field data shows poor page experience or performance regressions affect important templates.

## Inputs
Field metrics, lab traces, RUM, page templates, network waterfalls, deployment history, and business KPIs.

## Context to inspect
LCP candidates, interaction handlers, main-thread work, layout shifts, fonts, images, third parties, caching, and device/network segments.

## Core knowledge
Field data represents users; lab data helps reproduce causes. Optimize LCP, INP, and CLS through root causes rather than score chasing.

## Procedure
1. Segment field data by template and device.
2. Reproduce representative slow experiences.
3. Trace the dominant metric bottleneck.
4. Quantify candidate fixes.
5. Prioritize changes with product teams.
6. Implement the smallest high-impact fix.
7. Run regression and functional tests.
8. Measure field outcomes over sufficient traffic.

## Decision points
Optimize server, network, rendering, JavaScript, or assets according to evidence. Do not remove valuable functionality for marginal synthetic-score gains without product agreement.

## Common failure patterns
Using only Lighthouse, optimizing averages instead of percentiles, ignoring third parties, and declaring success from local tests.

## Verification
Confirm lab reproduction improves and field percentiles trend positively without harming conversion or accessibility.

## Expected output
Evidence chain from metric to root cause, remediation, regression checks, and field validation.

## Stop conditions
Escalate changes with material product, vendor, or infrastructure impact.