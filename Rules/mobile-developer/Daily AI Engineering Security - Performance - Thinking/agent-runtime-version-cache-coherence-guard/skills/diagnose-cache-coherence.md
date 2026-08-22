# Skill: Diagnose Runtime Cache Coherence

## Purpose
Determine whether an expensive resume is caused by predictable runtime/context fingerprint drift rather than ordinary task growth or cache expiry.

## Trigger
Unexpected cache creation on resume, a client update, cross-entrypoint resume, headless continuation, or a large session about to be resumed.

## Inputs
Previous stable runtime fingerprint, current fingerprint, context-token estimate, provider usage records, cache-miss diagnostics when available, and policy configuration.

## Preconditions
- Session identity is known.
- Fingerprint fields can be collected without exposing secrets.
- Usage records are deduplicated by request ID when the provider logs multiple records per request.

## Required context
Provider/model, client version, entrypoint, system-instruction hash, hook-context hash, tool-schema hash, cache policy, previous cache read/create metrics.

## Allowed tools
Read-only transcript inspection, hashing, version inspection, provider usage diagnostics, and `scripts/cache_coherence_guard.py`.

## Constraints
- Do not print raw system prompts, secrets, or private tool arguments just to compute hashes.
- Do not claim provider malfunction solely from a cache miss.
- Do not mutate or delete a session to recover cache reuse.
- Do not downgrade required safety/tool policy to preserve cache identity.

## Procedure
1. Capture the last known warm request: request ID, cache-read tokens, cache-create tokens, client version, entrypoint, and fingerprint hashes.
2. Capture the intended resume runtime using the same field set.
3. Estimate the current context size from the most recent provider usage record; prefer provider token accounting over character heuristics.
4. Run the coherence guard before resume.
5. If fingerprints match, allow resume and classify a later miss using provider diagnostics such as TTL expiry or provider-side eviction.
6. If fingerprints differ, classify mismatches as intentional or accidental. Version/entrypoint skew is high priority; safety-policy changes must never be suppressed.
7. For an intentional migration, record a human-readable reason and permit exactly one re-baseline attempt.
8. Measure the first two requests after resume. Compute reuse ratio = read / (read + create), excluding output tokens.
9. If the first request is cold but the second becomes warm, record a one-time migration. If both remain cold or alternate fingerprints, stop automation and escalate runtime skew.

## Decision points
- **No mismatch + miss:** investigate TTL/provider eviction/content mutation; do not blame runtime skew.
- **Mismatch + small context:** re-baseline may be acceptable, but record it.
- **Mismatch + large context:** require explicit migration reason before paying the rewrite.
- **Repeated mismatch:** block concurrent/stale entrypoint and reconcile installations.

## Expected output
A diagnostic record containing observed evidence, mismatch fields, predicted rewrite size, decision, post-resume metrics, and verification status.

## Metrics
Predicted and actual rewrite tokens, reuse ratio, first-resume latency, repeated cold resumes, and cost delta.

## Verification
A diagnosis is verified only when runtime metadata and usage evidence agree. A successful improvement requires later resumes with stable fingerprints and warm-cache behavior under comparable conditions.

## Failure handling
If fingerprint metadata is unavailable, mark the result unverified and use a conservative manual resume. If logs disagree, prefer raw provider usage per request over aggregate UI counters.

## Stop conditions
Stop after one intentional re-baseline. Stop immediately if safety policy would need to be weakened, if alternating runtimes continue resuming the session, or if two post-resume requests remain unexpectedly cold without a supported explanation.
