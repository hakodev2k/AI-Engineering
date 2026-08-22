# Routing Rules

## Purpose
Make navigation, authorization boundaries, deep links, and route state predictable.

## Scope
Vue Router or equivalent routing, guards, parameters, query state, lazy routes, and navigation failures.

## MUST
- Routes MUST have stable ownership and documented parameter/query contracts when externally linkable.
- Authorization-sensitive routes MUST enforce access on the server or trusted backend in addition to client navigation controls.
- Route guards MUST terminate deterministically and handle asynchronous failures.
- User-visible state encoded in URLs MUST be validated before use.
- Lazy route failures and navigation errors MUST have recoverable handling where they can occur in production.

## MUST NOT
- Client-side route guards MUST NOT be treated as a security boundary.
- Components MUST NOT depend on undocumented route string parsing when named routes or typed contracts are available.
- Sensitive secrets MUST NOT be placed in URLs.

## SHOULD
- Prefer route-level code splitting for substantial feature boundaries.
- Preserve useful navigation state in URLs when it improves deep-linking and reproducibility without exposing sensitive data.

## Exceptions
Transient purely local UI state need not be URL-addressable when restoration or sharing has no product value.

## Verification
Test direct navigation, refresh, invalid parameters, unauthorized access, guard failures, lazy-load failures, and browser history behavior.