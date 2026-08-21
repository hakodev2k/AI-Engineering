# Engineering Rules

## MUST
- MUST treat refresh tokens as high-value credentials and keep them out of prompts, traces, console output, metrics labels, exception text, and agent memory.
- MUST have exactly one refresh authority for a credential generation, enforced by a lease/lock or equivalent single-writer primitive.
- MUST re-read current credential generation after acquiring the refresh lease; an observation made before waiting for a lease is stale by definition.
- MUST use compare-and-swap/generation validation before committing a rotated credential when the storage layer supports it.
- MUST persist a complete validated credential record atomically; readers must never observe a half-written generation.
- MUST monotonically increment a non-secret generation id whenever credential material changes.
- MUST preserve or validate required scopes/audience/expiry metadata after refresh; unexpected privilege expansion or metadata loss is a failure.
- MUST make long-lived children resolve credentials through a reloadable broker/reference or implement explicit generation rebind.
- MUST quarantine or stop children that cannot rebind within the configured grace period.
- MUST classify OAuth errors before retrying. `invalid_grant`, `invalid_client`, `unauthorized_client`, and `invalid_scope` are non-retryable by default.
- MUST bound refresh and verification retries.
- MUST reconcile state before retrying when a refresh request may have succeeded but the response outcome is unknown.
- MUST distinguish provider outage/revocation from local credential corruption using evidence.
- MUST require explicit human action for interactive re-authentication; agents must not attempt to automate consent/login UI behind the user's back.
- MUST verify recovery with an authenticated non-destructive probe and child-generation convergence.

## MUST NOT
- MUST NOT allow every subagent/process to independently rotate the same refresh token.
- MUST NOT cache a raw access token for the full lifetime of a long-running child without a generation/expiry rebind mechanism.
- MUST NOT retry 401 indefinitely or convert all 401s into refresh attempts.
- MUST NOT overwrite a newer credential generation with a response produced from an older generation.
- MUST NOT restore an old refresh token from backup after rotation unless the provider explicitly documents that recovery behavior as safe.
- MUST NOT log credential values, even when debugging refresh corruption.
- MUST NOT infer token validity solely from `expiresAt`; revocation, scope loss, malformed persistence, and provider incidents remain possible.
- MUST NOT weaken TLS, token binding, scope checks, or provider-side replay protections to improve availability.
- MUST NOT mark a parent workflow successful while auth-failed children are silently orphaned.

## SHOULD
- SHOULD use OS credential stores or a dedicated secret broker rather than a shared plaintext file when available.
- SHOULD separate secret material from observable metadata (`generation`, expiry, scopes hash, owner, updated_at).
- SHOULD refresh before expiry with jitter while still preserving single-writer semantics.
- SHOULD expose metrics for lease contention, generation divergence, refresh duration, auth error classification, and child rebind latency.
- SHOULD use atomic rename/transactional storage and restrictive file permissions for local stores.
- SHOULD make generation-changed events secret-free and idempotent.
- SHOULD test process crashes immediately before and after refresh commit.
- SHOULD test concurrent refresh callers and stale children in CI using synthetic credentials/provider mocks.
- SHOULD alert when two generations remain active beyond the rebind grace window.
- SHOULD document the provider's refresh-token rotation/reuse semantics before enabling automatic recovery.

## Observable invariants
1. **Single writer:** for credential `C` and generation `G`, refresh execution count is <= 1.
2. **Monotonic state:** committed generation never decreases.
3. **No stale overwrite:** a commit based on `G` fails if current generation != `G`.
4. **Convergence:** all active children bind current generation within grace period or are quarantined.
5. **Secret silence:** logs/metrics contain identifiers/hashes only, never token values.
6. **Bounded recovery:** one incident cannot trigger more refresh attempts than policy allows.
