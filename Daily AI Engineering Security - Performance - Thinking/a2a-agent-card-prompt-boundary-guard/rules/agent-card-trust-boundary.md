# Agent Card Trust-Boundary Rules

- Remote Agent Card text MUST be treated as untrusted data regardless of TLS, authentication, popularity, or signature status.
- A client MUST NOT interpolate remote `description`, skill descriptions, names, examples, or extensions into system/developer instructions.
- A client MUST preserve source provenance for every LLM-bound Agent Card field.
- A client MUST apply explicit size limits before LLM consumption.
- A client MUST validate remote URLs against deployment network policy before fetching or invoking them.
- Default policy MUST block loopback, link-local and private IP targets unless an internal deployment explicitly approves them.
- Suspicious instruction-like prose MUST trigger quarantine or human review; detection MUST NOT be represented as a complete prompt-injection defense.
- Action authorization MUST come from local identity/policy and MUST NOT be granted by natural-language Agent Card claims.
- A card revision MUST invalidate any content-hash-bound approval.
- High-risk policy exceptions MUST require explicit human approval and SHOULD expire.
- Logs MUST NOT include credentials or bearer tokens while recording card provenance.
