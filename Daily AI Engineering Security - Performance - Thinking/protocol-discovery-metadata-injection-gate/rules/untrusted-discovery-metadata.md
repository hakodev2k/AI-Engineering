# Untrusted Discovery Metadata Rules

1. Remote MCP/A2A discovery text **MUST** be labeled with endpoint and protocol provenance.
2. Remote descriptions, instructions, skills, examples, titles, and tool annotations **MUST NOT** be inserted into system/developer instruction channels.
3. Remote metadata **MUST NOT** add tools, permissions, scopes, filesystem paths, credentials, network destinations, or approval exemptions beyond local policy.
4. The client **MUST** enforce schema and size limits before model ingestion.
5. Unknown provenance, invalid schema, or policy-evaluation failure **MUST** fail closed.
6. Suspicious metadata **MUST** be logged by hash and finding; logs **MUST NOT** include secrets.
7. High-impact actions influenced by remote metadata **MUST** pass an independent deterministic authorization check and **MUST** require human approval when local policy says so.
8. Sanitization or prompt wording **MUST NOT** be the sole authorization boundary.
9. Clients **SHOULD** provide a data-only quoted representation for benign descriptive metadata.
10. Clients **SHOULD** retain a source-to-action audit chain for governed actions.
11. Security regression tests **MUST** include role override, secret request, permission expansion, encoded instruction, and benign-description fixtures.
12. The implementing component **MUST NOT** be the only verifier for changes that affect high-impact tool authorization.
