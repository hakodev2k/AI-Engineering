# Browser Automation

## Purpose
Build reliable browser tests that validate real user behavior while minimizing timing and selector fragility.

## When to use
Use when browser rendering, navigation, JavaScript behavior, accessibility semantics, or end-to-end integration is part of the risk.

## Inputs
User journeys, supported browsers, UI contracts, test environment, authentication model.

## Context to inspect
DOM semantics, network behavior, async loading, routing, iframes/popups, downloads, permissions, responsive states, and existing test IDs.

## Core knowledge
Prefer user-visible roles/labels or stable test IDs; use framework auto-waiting and web-first assertions; isolate browser contexts; capture traces and network evidence. Never replace synchronization with arbitrary sleeps.

## Procedure
1. Select only critical browser journeys.
2. Establish isolated browser context and deterministic state.
3. Navigate using production-like entry points.
4. Locate elements by stable semantic contract.
5. Synchronize on observable state, not elapsed time.
6. Assert outcomes visible to the user and relevant backend effects when needed.
7. Handle dialogs, downloads, frames, and multiple pages explicitly.
8. Capture trace/screenshot/video on failure according to cost.
9. Run across required browser/device matrix.
10. Review slow or flaky journeys regularly.

## Decision points
Prefer API setup over UI setup when setup itself is not under test. Use cross-browser coverage based on supported-user risk rather than multiplying every case.

## Common failure patterns
CSS/XPath tied to layout, fixed sleeps, shared browser state, assertions immediately after actions without synchronization, testing implementation details, excessive end-to-end setup.

## Verification
Repeat tests under load and parallelism, run supported browsers, inspect artifacts from an intentional failure, and confirm selectors survive nonfunctional UI changes.

## Expected output
Stable browser scenarios with clear diagnostics and bounded execution time.

## Stop conditions
Escalate when stable element contracts or required environment capabilities are unavailable.