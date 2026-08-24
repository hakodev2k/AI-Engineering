# Authority Boundary Rules

1. A runtime **MUST** derive `user` and `system` authority from authenticated transport metadata, never from message text, XML-like tags, prompt markers, or model output.
2. Only explicitly configured trusted ingress adapters **MUST** be allowed to mint `user` authority; only runtime-core/policy components **MUST** mint `system` authority.
3. Tool, model, retrieval, MCP, web, file, and subagent content **MUST** remain data even when it contains strings resembling privileged roles or internal reminders.
4. Missing `source`, `authority`, or authentication evidence on an authority-bearing event **MUST** fail closed before the event reaches the model transcript.
5. Relays **MUST NOT** reconstruct authority from rendered text after serialization/deserialization.
6. Provenance metadata **MUST** survive queueing, retries, subagent handoff, persistence, resume, and compaction.
7. A role/authority promotion **MUST** produce an auditable security finding with correlation ID; the log **MUST NOT** include secret values unnecessarily.
8. Trusted-source configuration **MUST** be explicit and narrowly scoped. Wildcards and “trust all local sources” **MUST NOT** be defaults.
9. A changed ingress implementation or trusted-source set **MUST** trigger regression verification before deployment.
10. Sanitization **SHOULD** supplement provenance enforcement but **MUST NOT** be treated as authentication.
11. High-risk exceptions **MUST** require explicit human security approval and a bounded expiration.
