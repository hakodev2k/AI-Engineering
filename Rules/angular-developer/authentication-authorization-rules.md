# Authentication and Authorization Rules

## Purpose
Prevent Angular client behavior from being mistaken for trusted identity or access enforcement.

## Scope
Login state, tokens, session UX, route visibility, permission-aware UI, and privileged operations.

## MUST
- Treat the browser as untrusted and enforce authorization on the server for protected operations and data.
- Minimize token exposure and follow the application's approved session/token storage architecture.
- Handle session expiry, revocation, and reauthentication without leaking protected content.
- Base UI permission decisions on explicit authorization information rather than role-name guesses.

## MUST NOT
- Embed client secrets, service credentials, or privileged keys in Angular bundles.
- Rely on hidden buttons, route guards, or disabled controls as authorization enforcement.
- Log access tokens or authentication artifacts.

## SHOULD
- Default privileged UI actions to unavailable until authorization state is known.

## Exceptions
Public-only applications may omit authenticated flows but must still protect any privileged backend endpoint independently.

## Verification
Inspect bundles/config, browser storage, network traces, server authorization tests, expired-session behavior, and permission matrices.