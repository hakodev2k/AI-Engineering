# Rules: Safe Tool-Result Reuse
- First observation MUST be sent in full.
- Only explicitly configured read-only deterministic tools MAY be reused.
- Reuse MUST require matching canonical call, result hash, and dependency fingerprint when configured.
- Mutating, approval-gated, secret-bearing, time-sensitive, or dependency-unknown results MUST NOT be reused.
- TTL expiry MUST force full content.
- Full-result fallback MUST remain available.
- Logs MUST contain hashes/reason codes, not secret payloads.
- Token savings MUST NOT be accepted without quality-regression measurement.
