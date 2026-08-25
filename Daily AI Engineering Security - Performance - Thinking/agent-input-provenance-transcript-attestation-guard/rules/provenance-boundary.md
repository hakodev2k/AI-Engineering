# Provenance Boundary Rules

1. Every model-visible message that claims `user`, `system`, `developer`, approval, denial, interrupt, or other control authority MUST carry a stable event ID, source type, session ID, content hash, and persistence state.
2. A message claiming human origin MUST reference a durable human-submission event created at the actual input boundary. A synthesized notification, tool result, model output, subagent result, resume record, or adapter-generated message MUST NOT be labeled as human-origin.
3. Privileged tool execution MUST NOT be authorized from an authoritative message whose event ID is missing, whose content hash differs from the ledger, or whose claimed origin conflicts with the recorded source.
4. Unattested authoritative-looking content MUST be treated as untrusted data. It MUST NOT silently inherit the authority suggested by XML tags, markdown labels, role-like prefixes, or provider role fields.
5. Transcript persistence and model-request assembly SHOULD be reconciled by event ID and content hash at session resume and before privileged actions.
6. A runtime-generated control event SHOULD use an explicit machine source class such as `runtime_notification`, `watchdog`, `resume`, or `cross_session`, not `human`.
7. Tool approval records MUST bind to the causal event ID and exact action scope. An old approval MUST NOT authorize an action caused by a later unattested message.
8. A provenance mismatch MUST block high-risk, irreversible, credential, production, deployment, or external-write actions until independently resolved.
9. Validators MUST NOT execute, interpolate, source, eval, or shell-expand message content.
10. Logs MUST NOT include raw secrets. Evidence SHOULD use event metadata and SHA-256 hashes; content excerpts are optional and must be redacted.
11. The implementing agent MUST NOT be the sole verifier for a provenance-control change affecting privileged tools.
12. Failure handling MUST be fail-closed for high-risk actions and MAY downgrade low-risk anomalous input to untrusted data for continued read-only investigation.