# Serialization Rules
## Purpose
Protect compatibility and prevent unsafe object reconstruction.
## Scope
JSON, binary formats, caches, messages, and persisted serialized data.
## MUST
- Serialized contracts crossing process or persistence boundaries MUST have defined compatibility expectations.
- Untrusted serialized input MUST use safe parsers and explicit validation.
- Schema evolution MUST account for old producers and consumers where coexistence occurs.
## MUST NOT
- MUST NOT deserialize untrusted pickle-like executable object formats.
- MUST NOT encode incidental internal object layout as a durable public contract unintentionally.
## SHOULD
- Prefer explicit schemas for long-lived contracts.
## Exceptions
Trusted local ephemeral caches require documented trust and invalidation assumptions.
## Verification
Compatibility tests, malformed-input tests, and security review.