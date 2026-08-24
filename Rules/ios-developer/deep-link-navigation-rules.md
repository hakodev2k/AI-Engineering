# Deep Link and Navigation Rules

## Purpose
Keep external entry points safe, deterministic, and compatible with application state.

## Scope
Universal links, custom URL schemes, notifications, handoff, shortcuts, and internal routing.

## MUST
- External route inputs MUST be parsed and validated before navigation or state mutation.
- Authorization MUST be re-evaluated for protected destinations regardless of link origin.
- Routing MUST define behavior for cold start, warm start, signed-out state, and unavailable content.
- Universal-link domain association and fallback behavior MUST be tested before release.
- Route contracts exposed externally MUST be versioned or evolved compatibly.

## MUST NOT
- MUST NOT trust arbitrary URL parameters as authorization or identity evidence.
- MUST NOT execute privileged actions solely because a custom URL scheme was invoked.
- MUST NOT allow malformed routes to leave navigation state inconsistent.

## SHOULD
- Centralize route parsing separately from feature navigation execution.
- Make routes represent intent rather than concrete view-controller implementation.

## Exceptions
Legacy route behavior may remain only with compatibility evidence, bounded risk, and migration ownership.

## Verification
Test valid, malformed, unauthorized, stale, cold-start, background, and multi-scene entry paths; inspect associated-domain configuration and route parsing tests.