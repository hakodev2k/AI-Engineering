# Rendering Critical Path Rules

## Purpose
Minimize work that delays meaningful visual output and interactive readiness.

## Scope
Applies to HTML delivery, CSS, scripts, rendering, hydration, layout, paint, and critical resource discovery.

## MUST
- Identify which resources and computations block first meaningful rendering on critical routes.
- Prioritize only resources required for above-the-fold user value.
- Measure layout, style, paint, and hydration cost before restructuring the rendering path.
- Preserve semantic correctness and accessibility when applying rendering optimizations.

## MUST NOT
- Mark resources as critical without evidence they improve user-visible timing.
- Inline unbounded assets or code that increases HTML cost beyond measured benefit.
- Trade correctness or security for faster paint without explicit approval.

## SHOULD
- Allow the browser to discover critical resources early and defer non-critical work.
- Prefer rendering strategies appropriate to content volatility, personalization, and cacheability.

## Exceptions
Exceptions require trace evidence, alternatives considered, impact assessment, and review.

## Verification
Use waterfall analysis, browser traces, paint timing, rendering diagnostics, and field metrics for affected routes.