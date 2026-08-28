# Rules: Provider Signature Retention

- Provider-specific signatures MUST be tracked separately from ordinary user-visible text/context.
- A signature required by the current provider protocol for an active function-calling step MUST be replayed byte-for-byte.
- Required active signatures MUST NOT be removed to satisfy a token budget.
- Missing required active signatures MUST block request construction when the provider contract requires them.
- Archival signatures SHOULD be excluded from outbound model context once they are no longer protocol-required.
- Optional/recommended historical signatures MUST be subject to an explicit byte/token budget.
- Retention policy MUST use provider/model/part/lifecycle metadata, not message age alone.
- Token accounting MUST include opaque signature bytes or an explicitly documented estimate.
- Compression MUST reserve headroom before the context limit; it MUST NOT wait until mandatory metadata can no longer fit.
- Cross-provider or cross-model handoffs MUST re-evaluate signature requirements rather than blindly copying or stripping metadata.
- Opaque signatures MUST NOT be decoded, displayed, or logged in plaintext; diagnostic hashes SHOULD be used instead.
- Quality regression fixtures MUST accompany any policy that removes optional signatures.
