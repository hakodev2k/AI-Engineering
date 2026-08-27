# Lightning Web Component Rules

## Purpose
Keep Lightning Web Components secure, accessible, maintainable, and efficient.

## Scope
Applies to LWC presentation, state, Apex calls, Lightning Data Service, and component composition.

## MUST
- Components MUST keep presentation concerns separate from reusable business logic and server-side policy enforcement.
- Client code MUST treat all external and server-returned data as untrusted until validated for its use context.
- Accessibility requirements MUST be preserved for interactive controls, focus, labels, keyboard behavior, and status messaging.
- Expensive rerendering or repeated server requests MUST be measured and corrected on material paths.

## MUST NOT
- MUST NOT enforce authorization only in client-side logic.
- MUST NOT expose secrets or privileged configuration to browser code.
- MUST NOT mutate public API state in ways that create hidden parent-child coupling.

## SHOULD
- Lightning Data Service SHOULD be preferred when it provides the required semantics and security model.
- Component APIs SHOULD remain small and explicit.

## Exceptions
Exceptions require documented UX, security, and maintainability trade-offs.

## Verification
Use component tests, accessibility checks, browser profiling, security review, and interaction tests.