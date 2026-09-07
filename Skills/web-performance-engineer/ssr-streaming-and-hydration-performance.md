# SSR Streaming and Hydration Performance

## Purpose
Optimize server-rendered applications across server response, HTML streaming, resource discovery, hydration, and post-render interactivity.

## When to use
Use when SSR improves visual load but interaction remains delayed, hydration blocks the main thread, or streaming boundaries perform poorly.

## Inputs
Server timings, browser traces, component/render tree, hydration markers, network waterfall, framework configuration, RUM CWV data.

## Context to inspect
Measure TTFB, HTML chunk timing, server data dependencies, Suspense/stream boundaries, client bundle size, hydration scope, mismatch errors, and interaction readiness.

## Core knowledge
SSR can move work rather than remove it. Fast HTML with heavy hydration may improve LCP while harming INP. Streaming is useful when boundaries allow important content to arrive independently. Partial/selective hydration reduces client work when architecture supports it.

## Procedure
1. Decompose navigation into server compute, HTML delivery, resource discovery, render, hydration, and interaction readiness.
2. Find serial server data dependencies delaying first useful HTML.
3. Define streaming boundaries around user-visible independent regions.
4. Ensure critical resources are discoverable before late streamed markup when possible.
5. Measure hydration CPU by component subtree.
6. Remove unnecessary client-side ownership and duplicate server/client computation.
7. Defer noninteractive hydration safely.
8. Break large hydration tasks where framework semantics allow.
9. Test slow devices, delayed streams, failed data dependencies, and hydration mismatches.
10. Validate both visual and interaction metrics in RUM.

## Decision points
Prefer server components/static output for content not needing client state. Use streaming when it releases meaningful content earlier; avoid boundaries that add complexity without shortening critical time. Hydrate eagerly only what users can interact with immediately.

## Common failure patterns
Optimizing TTFB while server serial waterfalls remain; sending HTML quickly but huge client bundles later; hydrating hidden components; excessive tiny streaming boundaries; ignoring mismatch recovery cost.

## Verification
Confirm earlier useful content, lower hydration CPU, improved interaction readiness, no mismatch/errors, and no regression in cacheability or SEO.

## Expected output
An end-to-end SSR/hydration timeline, prioritized architectural fixes, and field-validated results.

## Stop conditions
Escalate when required improvements depend on framework migration, rendering-model changes, or backend data architecture outside scope.