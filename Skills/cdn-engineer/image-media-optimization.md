# Image and Media Optimization

## Purpose
Deliver images and media efficiently using appropriate formats, transformations, caching, and quality controls.

## When to use
Use for image-heavy applications, bandwidth reduction, Core Web Vitals work, or dynamic media pipelines.

## Inputs
Source formats, dimensions, device distribution, quality requirements, transformation service, cache behavior.

## Context to inspect
Responsive markup, Accept negotiation, transformation URLs, cache keys, origin storage, signed transformations, quality metrics.

## Core knowledge
Modern formats such as AVIF and WebP can reduce bytes, but encoding cost and client support matter. Correct dimensions and responsive selection often save more than format changes alone.

## Procedure
1. Profile image/media bytes and viewport usage.
2. Define allowed dimensions, crops, quality levels, and formats.
3. Generate responsive variants rather than shipping oversized sources.
4. Negotiate modern formats with safe fallback.
5. Canonicalize transformation parameters to protect cache efficiency.
6. Restrict arbitrary transformations to prevent abuse.
7. Cache transformed outputs with long TTLs when deterministic.
8. Measure visual quality, LCP, transfer size, and transform latency.

## Decision points
Prefer build-time variants for bounded catalogs; use edge/on-demand transformation for large or dynamic libraries. Do not sacrifice visible quality solely for byte reduction.

## Common failure patterns
Unbounded resize parameters, cache-key explosion, oversized images, format negotiation mistakes, repeated transformation work, and unauthenticated expensive operations.

## Verification
Test representative devices, compare visual quality and bytes, confirm cache reuse, and monitor transformation error/CPU rates.

## Expected output
A media-delivery policy with transformation constraints, format strategy, cache model, and performance evidence.

## Stop conditions
Stop if transformations can be abused for denial-of-service or if source rights/compliance constraints are unclear.