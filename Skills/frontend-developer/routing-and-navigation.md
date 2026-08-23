# Routing and Navigation

## Purpose
Design predictable navigation, route ownership, deep linking, authorization boundaries, and browser-history behavior for frontend applications.

## When to use
Use when adding routes, nested layouts, protected areas, redirects, deep links, or fixing navigation/history defects.

## Inputs
Route requirements, information architecture, authorization rules, application shell, server hosting behavior, and analytics needs.

## Context to inspect
Route table, layouts, guards, loaders, URL parameters, query strings, history usage, fallback hosting configuration, and link components.

## Core knowledge
The URL is part of the application contract. Navigable state should survive refresh and support back/forward behavior. Client-side route guards improve UX but are never a security boundary; authorization must also be enforced by the server.

## Procedure
1. Map user-visible resources and workflows to stable URLs.
2. Define route hierarchy and layout ownership.
3. Decide which state belongs in path segments, query parameters, or local state.
4. Validate and normalize route inputs.
5. Define loading, not-found, unauthorized, and redirect behavior.
6. Configure lazy loading where beneficial.
7. Preserve expected browser back/forward semantics.
8. Verify server fallback and direct deep-link loading.
9. Add navigation analytics without blocking transitions.
10. Test refresh, bookmarks, malformed URLs, and permission changes.

## Decision points
Use path parameters for resource identity and query parameters for optional filters/view state. Redirect only when canonicalization or workflow semantics justify replacing history.

## Common failure patterns
UI-only authorization, storing shareable filters outside the URL, redirect loops, broken direct links, unvalidated route inputs, and replacing browser history unexpectedly.

## Verification
Every supported URL loads directly, browser navigation behaves predictably, unauthorized access is rejected by backend controls, and canonical links remain stable.

## Expected output
A tested route model with URL contracts, navigation behavior, loading/error states, and hosting requirements.

## Stop conditions
Escalate when resource identity is unstable, authorization rules conflict, or hosting cannot support required deep links.