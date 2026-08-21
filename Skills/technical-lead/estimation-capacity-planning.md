# Estimation and Capacity Planning

## Purpose
Produce credible delivery forecasts by combining scope decomposition, uncertainty, dependencies, and actual team capacity.

## When to use
Use for initiative planning, roadmap commitments, staffing discussions, and significant scope changes.

## Inputs
Decomposed work, historical throughput, team availability, dependencies, risks, unknowns, deadlines.

## Context to inspect
Inspect interruptions, support load, parallel initiatives, onboarding, review bottlenecks, external lead times, and historical estimation error.

## Core knowledge
Estimates are forecasts, not guarantees. Precision should match available evidence. Ranges and confidence communicate uncertainty better than arbitrary exact dates.

## Procedure
1. Ensure scope is decomposed enough to reason about.
2. Separate known work from discovery and risk.
3. Use historical delivery evidence where comparable.
4. Account for dependencies and queue time.
5. Model realistic capacity rather than nominal headcount.
6. Estimate ranges and confidence.
7. Identify assumptions that dominate the forecast.
8. Offer scope/time/capacity trade-offs.
9. Reforecast as work completes and unknowns resolve.
10. Compare outcomes to estimates to improve calibration.

## Decision points
Use coarse estimates early and finer estimates after discovery. Reduce scope before assuming sustained overtime or perfect parallelism.

## Common failure patterns
Single-point promises, estimating undefined work, treating all engineers as interchangeable capacity, and ignoring operational/support work.

## Verification
Forecast assumptions are visible, range is consistent with evidence, and reforecasting responds to actual throughput.

## Expected output
A transparent delivery forecast with range, confidence, dependencies, and options.

## Stop conditions
Stop when scope is too ambiguous for a meaningful forecast; perform discovery first.