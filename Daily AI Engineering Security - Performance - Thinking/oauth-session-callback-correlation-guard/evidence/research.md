# Research Evidence

## Topic
OAuth Session Callback Correlation Guard

## Category
Security

## Problem
Concurrent OAuth authorization flows in multi-session agent applications can be misrouted when pending authorization state is stored or resolved by the currently active session rather than by the exact transaction that initiated the flow. A callback may fail with a state mismatch or, more seriously, succeed but update the wrong local session.

## Why it matters now
A new Codex App report on 2026-08-20 describes two concurrent sessions where the callback initiated by Session A can be applied to Session B. An earlier Windows/WSL multi-instance report independently documented localhost callback listeners belonging to a different Codex instance and observable OAuth `State mismatch` failures. The fresh report shows a stronger failure mode: incorrect successful correlation instead of safe rejection.

## Affected users
Desktop/IDE agent users with concurrent tasks, plugin/connector OAuth flows, multi-window or multi-instance clients, and platform teams implementing delegated authorization callbacks.

## Current public evidence
### Observed evidence
- OpenAI Codex issue #39642 (2026-08-20): with two concurrent app sessions, completing Session A's browser authorization can associate the result with Session B; the issue explicitly calls for unique `state` correlation and per-session isolation.
- OpenAI Codex issue #12263: Windows/WSL multi-instance OAuth flows can reach a listener associated with another context and return `State mismatch`; the report demonstrates fixed localhost callback complexity across concurrent instances.
- RFC 6749 requires clients to implement CSRF protection for redirect endpoints and describes `state` as a value binding authorization request and callback.
- RFC 9700 (OAuth 2.0 Security BCP, January 2025) requires transaction-specific binding for redirect-based flows and emphasizes preventing mix-up/response injection.

### Interpretation
The common architectural risk is a mutable singleton or active-window/session pointer for pending OAuth state. When multiple transactions coexist, callback routing must be transaction-keyed, single-use, expiry-bounded, and bound to the initiating security/session context before any token or connection state is committed.

## Existing approaches
OAuth `state`, PKCE, exact redirect URI handling, and per-flow pending authorization storage are established defenses. Device-code flows avoid localhost callback routing in remote contexts.

## Remaining limitations
- `state` validation alone is insufficient if valid state is looked up and then committed through the wrong active session object.
- Fixed localhost callback endpoints can serve multiple instances or sessions.
- Last-writer-wins pending-flow storage can overwrite earlier transactions.
- UI/session activation can race with callback completion.
- Failures may be visible only after a wrong local session is mutated.

## Root-cause analysis
1. Pending authorization is not always modeled as an immutable transaction record.
2. Callback resolution may consult current UI/session state after validating `state`.
3. Transaction consumption and target-session mutation may not be atomic.
4. Concurrent starts can overwrite singleton pending state.
5. Missing replay/expiry/issuer checks broaden the correlation risk.

## Improvement opportunity
Introduce a transaction registry keyed by a cryptographically random, one-time state hash. Store the initiating session ID, provider/issuer identity, redirect URI, PKCE challenge metadata, creation/expiry, and expected callback route. Resolve callback only through this immutable registry; atomically consume it before session mutation; reject replay, missing, expired, issuer-mismatched, or session-detached callbacks; never route by active window.

## Relevant sources
- https://github.com/openai/codex/issues/39642
- https://github.com/openai/codex/issues/12263
- https://www.rfc-editor.org/rfc/rfc6749.html
- https://datatracker.ietf.org/doc/html/rfc9700

## Goal and metrics
Goal: zero wrong-session OAuth callback application under concurrent authorization flows.
Metrics: miscorrelated callbacks, state mismatches, replay rejection rate, expired-flow rejection, concurrent-flow success rate, orphaned pending flows, callback-to-commit latency, and cross-session mutation violations.

## Trigger / inputs / outputs
Trigger: OAuth flow start and redirect callback receipt.
Inputs: session ID, provider/issuer, redirect URI, state, PKCE metadata, callback parameters, transaction registry.
Outputs: `accept_and_bind`, `reject_unknown`, `reject_expired`, `reject_replay`, `reject_issuer`, or `reject_session`; audit-safe transaction ID and target session ID.