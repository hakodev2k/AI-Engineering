# Rules: Persistent Memory Integrity

- Every persistent memory write MUST include source provenance and an auditable source reference.
- Retrieved web/document/tool content MUST be treated as untrusted unless an explicit policy says otherwise.
- Untrusted content MUST NOT become durable memory solely because the model summarized or repeated it.
- General memory MUST NOT store tool authorization, credentials, security-policy overrides, or equivalent privileged state.
- Untrusted writes MUST require explicit human approval showing the exact value, source, namespace, and lifetime.
- Approved untrusted writes SHOULD use bounded TTLs and MUST remain removable without credential rotation.
- Memory consumers MUST NOT discard provenance when reloading an entry into context.
- Incident response MUST include inspection and removal of poisoned durable memory when prompt injection is suspected.
- Logs MUST contain decision metadata but MUST NOT contain secrets.
- A failed deterministic gate MUST block persistence; implementations MUST NOT downgrade the failure to a warning for convenience.
