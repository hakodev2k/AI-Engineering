# Rule: Cache Coherence Before Resume

- The host MUST persist a cache-relevant runtime fingerprint for resumable sessions.
- The fingerprint MUST include provider, model, client version, entrypoint, system-instruction hash, hook-context hash, tool-schema hash, and cache policy when those fields affect the request prefix.
- The host MUST compare the current runtime fingerprint with the last stable fingerprint before resuming a session above the configured context threshold.
- The host MUST NOT expose raw secrets or private prompt contents in the fingerprint; use deterministic cryptographic hashes.
- The host MUST NOT suppress a security-policy, tool-permission, or system-instruction change merely to preserve a cache hit.
- A large session with a critical fingerprint mismatch MUST NOT auto-resume unless an explicit re-baseline reason is recorded.
- A single intentional migration MAY create one cold baseline, but the host MUST measure the next requests to verify cache stability.
- The host MUST block repeated alternating resumes from incompatible entrypoints when they cause recurrent cache reconstruction.
- Cache performance claims MUST include measured cache-read/cache-create tokens and comparable request conditions.
- Aggregate quota percentages SHOULD NOT be used as the sole cache-coherence signal when per-request usage exists.
- Retry loops MUST be bounded to one re-baseline attempt for the same fingerprint transition.
- Failure to achieve a warm post-migration state MUST be surfaced as unresolved rather than hidden by additional retries.
