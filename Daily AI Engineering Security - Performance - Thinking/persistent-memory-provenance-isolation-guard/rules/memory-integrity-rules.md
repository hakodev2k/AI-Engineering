# Memory Integrity Rules

- Every durable memory MUST include tenant/profile scope, source type, source identifier, creation time, authority class, validation status, and lineage ID.
- A memory MUST NOT be injected into another tenant/profile's context.
- Tenant filtering MUST occur before vector similarity expansion, graph-neighborhood traversal, or entity merge whenever technically possible.
- Retrieved content MUST NOT become trusted merely because it is persistent.
- Untrusted user/tool/retrieved content that contains instruction-like language MUST be stored only as non-authoritative observation or quarantined.
- Operator policy and high-impact durable preferences MUST require explicit confirmation or an authenticated policy source before promotion.
- Quoted, hypothetical, third-party, or ambiguous text MUST NOT be promoted to operator policy without confirmation.
- Summaries and merges MUST preserve provenance and authority metadata or MUST downgrade the derived record to untrusted.
- Graph/entity merge logic MUST NOT merge cross-tenant claims solely because entity names or embeddings are similar.
- Memory retrieval presented to the model SHOULD include trust labels and provenance metadata, separated from system instructions.
- The system MUST retain lineage sufficient to retract or roll back poisoned derived memories.
- Unknown provenance MUST be treated as untrusted.
- Security tests MUST include cross-tenant canaries, ambiguous-policy fixtures, instruction-like payloads, and rollback scenarios.
- Detection of cross-tenant recall or unauthorized policy promotion MUST block completion.
- Retries MUST be bounded to two attempts and MUST NOT bypass tenant checks, promotion confirmation, provenance validation, or rollback requirements.
- Production memory deletion, mass rewrite, or irreversible migration MUST require explicit human approval and a verified backup/rollback path.