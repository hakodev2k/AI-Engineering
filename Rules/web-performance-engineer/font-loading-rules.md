# Font Loading Rules

## Purpose
Control font transfer and rendering behavior without sacrificing readability or brand requirements.

## Scope
Applies to web fonts, subsets, preload, fallback metrics, font-display behavior, and typography-related layout shifts.

## MUST
- Load only font families, weights, styles, and character ranges required by the product experience.
- Evaluate font behavior on slow connections and uncached visits.
- Prevent avoidable layout shifts caused by materially mismatched fallback metrics.
- Measure whether font preloads improve critical rendering before retaining them.

## MUST NOT
- Preload every font resource indiscriminately.
- Block readable content on non-critical fonts without explicit product justification.
- Introduce redundant font files or formats that materially increase transfer cost without compatibility need.

## SHOULD
- Subset fonts by actual language and character requirements.
- Prefer resilient fallback stacks and cached delivery.

## Exceptions
Exceptions require documented typography requirements, affected routes, measured impact, and review.

## Verification
Inspect network priority, font timing, render behavior, CLS attribution, transfer sizes, cache headers, and representative browser results.