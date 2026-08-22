# Routing and Navigation Rules
## Purpose
Keep navigation predictable, addressable, recoverable, and compatible.
## Scope
Routes, URLs, parameters, redirects, history, deep links, and route guards.
## MUST
- User-relevant navigational state MUST be encoded in the URL when deep linking or sharing is required.
- Route parameters and query values MUST be validated before use.
- Breaking route changes MUST define redirect or migration behavior for supported inbound links.
- Authorization-related route guards MUST complement, never replace, server-side authorization.
- Browser back/forward behavior MUST be tested for critical workflows.
## MUST NOT
- Sensitive secrets MUST NOT be placed in URLs.
- Navigation MUST NOT discard unsaved critical user work without an explicit product decision or warning.
## SHOULD
- Preserve stable, human-understandable routes where practical.
## Exceptions
Transient wizard state may remain non-addressable when restoring it would be unsafe or misleading.
## Verification
E2E tests should cover direct entry, refresh, invalid parameters, history, redirects, and guarded routes.