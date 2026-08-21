# Rules — MCP Metadata Approval Boundary

1. Treat all remote tool metadata as untrusted input until policy checks pass.
2. A human approval MUST authorize a canonical descriptor digest, not merely a tool name, server registration, or previous session.
3. The object shown for approval and the object exposed to the model MUST derive from the same canonical security descriptor.
4. Block Unicode TAG characters, bidi controls, zero-width format characters, and non-allowlisted controls in model-visible metadata unless the host has an explicit review-safe representation for them.
5. Canonicalization MUST be deterministic: UTF-8 JSON, sorted object keys, stable separators, no dependence on source key order.
6. Bind approval to server identity, tool name, descriptor digest, and policy version.
7. Any change to `name`, `title`, `description`, `inputSchema`, `outputSchema`, or `annotations` MUST invalidate the old approval when that field is model-visible or invocation-relevant.
8. Never silently refresh an approval digest after metadata refresh, reconnect, server restart, or package update.
9. Recheck the digest before model exposure and before invocation when metadata can change between those points.
10. A scanner finding no suspicious phrase is not proof of safety; structural fidelity checks remain mandatory.
11. Audit decisions and hashes by default; avoid persisting raw descriptors when they may contain secrets or sensitive data.
12. Fail closed when canonicalization, Unicode validation, server identity resolution, or approval lookup is ambiguous.