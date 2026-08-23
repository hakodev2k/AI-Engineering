# Approval Annotation Rules

- Clients MUST preserve MCP tool annotations across discovery, adapters, caches and approval context.
- Implementations MUST support both wire-schema naming and the SDK-native naming used by their dependency version.
- Missing, malformed, contradictory or unverified annotations MUST NOT reduce approval requirements.
- `readOnlyHint=true` SHOULD only make a tool eligible for a lower-friction policy after independent policy checks.
- `destructiveHint=true` or `openWorldHint=true` MUST preserve or increase approval scrutiny.
- Tool name MUST NOT be the sole semantic risk signal when structured metadata is available.
- Approval decisions MUST bind to tool identity and an annotation snapshot/version; refreshed metadata MUST trigger re-evaluation.
- Tests MUST include serialized dictionary and live-object shapes.
- Server-provided annotations MUST be treated as advisory claims, not proof of authorization or safety.