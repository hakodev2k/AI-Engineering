# Rules: Hook Trust Boundary

- Every executable hook MUST have a non-empty `source_id` before source-scoped approval.
- Configuration file location MUST NOT be treated as proof of plugin/source provenance.
- Approval MUST bind exact command hash, source ID, hook event and source version.
- Global `trust all` MUST NOT be used when unrelated pending hooks exist.
- A changed command hash MUST invalidate its prior approval.
- A source identity change MUST require re-review even when command bytes match.
- Unrelated source approvals MUST remain unchanged when one plugin updates.
- Review tooling MUST NOT execute hooks while computing provenance.
- Trust-bypass flags MUST NOT be persisted as a workaround for discovery/trust defects.
- Managed enterprise policy MUST remain authoritative over local approvals.
- Human approval is REQUIRED before a new executable source becomes trusted unless organizational managed policy already establishes that trust.
