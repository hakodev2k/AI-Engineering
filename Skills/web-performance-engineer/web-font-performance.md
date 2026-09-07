# Web Font Performance

## Purpose
Deliver fonts with minimal render delay, layout instability, and unnecessary transfer while preserving typography and international coverage.

## When to use
Use when fonts block text, cause FOIT/FOUT or CLS, create many requests, or dominate startup bytes.

## Inputs
Font families/weights, CSS, glyph coverage, locale requirements, cache/CDN policy, loading traces.

## Context to inspect
Identify actually used families, weights, styles, unicode ranges, fallback metrics, origin, preload rules, and whether text is critical to LCP.

## Core knowledge
Font cost includes discovery, transfer, decode, style matching, and fallback-to-final metric changes. Subsetting helps only when coverage remains correct. Preloading too many font files competes with other critical resources.

## Procedure
1. Inventory requested versus actually rendered variants.
2. Remove unused families, weights, and styles.
3. Choose `font-display` behavior based on content priority.
4. Subset by script/locale when operationally safe.
5. Self-host or use external hosting based on privacy, caching, and operations.
6. Preload only the small set certain to be used immediately.
7. Tune fallback metrics to reduce layout shift where supported.
8. Use long-lived caching for versioned font assets.
9. Test cold cache, slow network, locale changes, and failure fallback.
10. Verify typography, CLS, LCP, and accessibility.

## Decision points
Prefer system fonts when brand value does not justify web-font cost. Use variable fonts when they reduce total variants without increasing decode or unused glyph cost.

## Common failure patterns
Preloading every weight; downloading unsupported scripts for all users; invisible text for long periods; cross-origin misconfiguration; font swaps causing large metric shifts.

## Verification
Confirm request count/bytes decline, fallback remains readable, final metrics are stable, and all required languages render correctly.

## Expected output
A documented font-loading policy and measured before/after results.

## Stop conditions
Escalate when licensing, brand requirements, or multilingual coverage prevents safe optimization.