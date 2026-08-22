# Vue Router Navigation

## Purpose
Design robust routing, navigation guards, route data, and URL state for Vue applications.

## When to use
Use for new routes, protected navigation, nested layouts, deep linking, or routing defects.

## Inputs
Route requirements, authorization rules, layouts, query parameters, and navigation flows.

## Context to inspect
Inspect router configuration, history mode, server fallback, guards, lazy imports, route metadata, and analytics hooks.

## Core knowledge
URLs are public application contracts. Authentication and authorization are distinct; client guards improve UX but cannot enforce server security. Route params and query values are untrusted inputs.

## Procedure
1. Define stable route semantics and hierarchy.
2. Choose path, params, query, and hash responsibilities.
3. Lazy-load appropriate route bundles.
4. Centralize reusable route metadata.
5. Implement guards without redirect loops.
6. Preserve intended destinations across login when appropriate.
7. Validate and normalize route inputs.
8. Configure server history fallback.
9. Test direct navigation, refresh, back/forward, unauthorized flows, and invalid URLs.

## Decision points
Use URL state for shareable/bookmarkable state; local state for transient UI details. Prefer route-level guards for navigation concerns and server authorization for actual access control.

## Common failure patterns
Guard loops, authorization only in frontend, unstable URL schemas, loading entire application eagerly, losing query state, and broken refresh under history mode.

## Verification
Verify deep links, browser history, redirects, permission UX, 404 behavior, and production server routing.

## Expected output
Stable, secure-by-design navigation behavior with testable route contracts.

## Stop conditions
Stop if authorization policy or deployment routing behavior is unknown.