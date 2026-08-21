# Routing Rules

## Purpose
Keep client-side navigation, deep links, route state, and authorization-related UX predictable.

## Scope
Applies to route definitions, nested routes, navigation state, redirects, and route-level data/loading behavior.

## MUST
- Routes MUST have stable, intentional URLs for shareable user-visible locations.
- Route parameters and query values MUST be validated before use.
- Redirects MUST preserve security and navigation intent without creating loops.
- Route-level loading and error states MUST be defined for asynchronous transitions when relevant.
- Access-restricted routes MUST rely on server-enforced authorization even when client guards are present.

## MUST NOT
- MUST NOT encode secrets or sensitive values in URLs.
- MUST NOT use navigation guards as the only authorization control.
- MUST NOT break existing deep links without a migration or redirect strategy when compatibility matters.

## SHOULD
- Prefer URL state for filters, tabs, and pagination that users reasonably expect to share or revisit.
- Prefer route boundaries that align with feature ownership and code splitting.

## Exceptions
Document incompatible URL changes, affected consumers, migration plan, and approval.

## Verification
Use navigation tests, direct-load/deep-link tests, browser history testing, redirect-loop tests, and contract review for public URLs.