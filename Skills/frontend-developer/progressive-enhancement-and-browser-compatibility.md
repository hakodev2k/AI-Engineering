# Progressive Enhancement and Browser Compatibility

## Purpose
Deliver robust frontend behavior across supported browsers and capability levels by establishing functional baselines, feature detection, compatibility policy, and graceful enhancement.

## When to use
Use when adopting new browser features, supporting heterogeneous devices, diagnosing browser-specific failures, or defining fallback behavior.

## Inputs
Browser support policy, analytics, feature requirements, compatibility data, performance constraints, and existing polyfills/transpilation.

## Context to inspect
HTML baseline, CSS features, JavaScript syntax/transforms, polyfills, feature detection, browser-specific workarounds, and real-user browser distribution.

## Core knowledge
Progressive enhancement starts from meaningful content/core actions and adds capabilities where available. Feature detection is safer than user-agent assumptions. Compatibility includes performance and input behavior, not merely syntax support.

## Procedure
1. Identify the minimum usable experience.
2. Confirm supported browsers/devices from policy and evidence.
3. Check each new platform feature against that support matrix.
4. Prefer native semantic baseline behavior.
5. Add feature detection for optional enhancements.
6. Polyfill only when business value exceeds payload/maintenance cost.
7. Keep browser workarounds isolated and documented.
8. Test keyboard, touch, pointer, viewport, and relevant browser engines.
9. Verify failure behavior when enhancement code does not load.
10. Remove obsolete workarounds as support policy evolves.

## Decision points
Use a polyfill for required capabilities with manageable cost; otherwise provide a simpler fallback. Drop legacy support only through explicit product/platform policy, not incidental developer preference.

## Common failure patterns
UA sniffing, loading broad polyfill bundles, JavaScript-dependent basic navigation, untested Safari/mobile behavior, permanent vendor hacks, and equating transpilation with full API compatibility.

## Verification
Core workflows function in all supported browsers, optional enhancements fail gracefully, compatibility tests cover relevant engines/input modes, and shipped polyfills match actual need.

## Expected output
A compatibility-conscious implementation with baseline behavior, enhancements, fallbacks, and documented support decisions.

## Stop conditions
Escalate when requested capability cannot be provided on a supported browser, dropping support requires product approval, or fallback semantics would violate a critical requirement.