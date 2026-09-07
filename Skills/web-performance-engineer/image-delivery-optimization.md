# Image Delivery Optimization

## Purpose
Reduce image transfer, decode, memory, and rendering cost while preserving visual quality, responsiveness, and accessibility.

## When to use
Use when images dominate page weight, LCP is image-based, responsive images are oversized, or galleries/content feeds cause decode and memory pressure.

## Inputs
Image inventory, rendered dimensions, DPR distribution, formats, CDN/image service capabilities, RUM LCP attribution, visual requirements.

## Context to inspect
Identify above-fold versus deferred images, intrinsic dimensions, `srcset`/`sizes`, crop semantics, format negotiation, cache policy, quality settings, and whether an image is the LCP candidate.

## Core knowledge
The correct optimization balances encoded size, decode cost, visual fidelity, cacheability, and discovery. Responsive source selection prevents mobile users downloading desktop assets. LCP images usually should not be lazily loaded.

## Procedure
1. Rank images by transfer bytes and user-criticality.
2. Compare encoded dimensions with actual rendered size and DPR needs.
3. Define responsive breakpoints based on layout, not arbitrary device labels.
4. Select modern formats using measured quality and compatibility.
5. Ensure width/height or aspect ratio prevents layout shift.
6. Prioritize the likely LCP image and avoid lazy-loading it.
7. Lazy-load genuinely offscreen content with appropriate thresholds.
8. Configure immutable caching for versioned assets.
9. Test decode/render behavior on low-memory devices.
10. Verify visual quality at representative DPRs and zoom levels.

## Decision points
Choose AVIF/WebP/original format based on measured size, decode support, and content type. Use an image CDN when transformation variability and operational volume justify it. Avoid excessive variant counts that destroy cache efficiency.

## Common failure patterns
CSS-resizing huge originals; incorrect `sizes`; lazy-loading hero images; missing intrinsic dimensions; quality settings chosen by file size alone; generating too many unique CDN transformations.

## Verification
Confirm smaller transferred bytes, correct source selection, stable layout, acceptable visual quality, and improved image-related LCP without decode regressions.

## Expected output
A responsive image-delivery policy and verified changes for high-impact images.

## Stop conditions
Escalate when brand/legal fidelity requirements conflict with feasible compression or media infrastructure must change.