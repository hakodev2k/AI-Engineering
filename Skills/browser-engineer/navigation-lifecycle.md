# Navigation Lifecycle

## Purpose
Design and debug browser navigations across URL resolution, policy checks, network fetch, redirects, document commit, history, and cancellation.

## When to use
Use for navigation features, redirect bugs, wrong-document commits, history issues, or cross-origin transitions.

## Inputs
Navigation requirement, traces, URLs, response headers, policy configuration, reproduction steps.

## Context to inspect
Navigation controller, frame tree, redirect chain, origin changes, history state, process selection, cancellation and commit paths.

## Core knowledge
Navigation is asynchronous and stateful. Redirects can change origin and policy. A navigation may be replaced, cancelled, fail before commit, or commit into a different renderer. History traversal differs from new navigation.

## Procedure
1. Reproduce and record the complete navigation chain.
2. Classify new navigation, reload, history traversal, same-document, or download.
3. Trace initiator, target frame, redirects, policy decisions, response, and commit.
4. Check origin and process changes at every redirect.
5. Verify cancellation when a newer navigation supersedes the old one.
6. Validate history entries and restoration state.
7. Test network failure, renderer crash, and user abort.
8. Add deterministic coverage for the discovered state transition.

## Decision points
Choose same-document handling only when semantics permit it. Preserve history when user expectations require back/forward restoration. Never bypass security checks to simplify redirects.

## Common failure patterns
Stale callbacks committing old navigations; policy checked only on initial URL; duplicate history entries; incorrect frame ownership; lost cancellation.

## Verification
Inspect navigation traces, assert committed URL/origin/process, exercise redirects and cancellation, and verify back/forward behavior.

## Expected output
A correct navigation state machine change or root-cause report with regression coverage.

## Stop conditions
Stop when reproduction depends on unavailable credentials, security policy ownership is ambiguous, or external protocol handling requires approval.