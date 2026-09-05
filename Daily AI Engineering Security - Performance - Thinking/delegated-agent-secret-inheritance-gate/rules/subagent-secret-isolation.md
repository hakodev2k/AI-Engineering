# Subagent Secret Isolation Rules

1. Delegated agents **MUST NOT** inherit the parent's complete environment by default.
2. Child environments **MUST** use explicit allowlists.
3. Sensitive credentials **MUST NOT** be readable by a child that does not require them.
4. Sensitive credentials **SHOULD** use opaque destination-scoped brokers/references.
5. Readable sensitive credentials **MUST** have explicit need, approval, minimum scope, and bounded lifetime.
6. Filtering **MUST** occur before delegated code/tools can execute.
7. Subprocess-only scrubbing **MUST NOT** count as sufficient if the child shares parent environment.
8. Artifacts **MUST NOT** contain secret values.
9. Negative tests **MUST** verify sentinel parent credentials are absent from unauthorized children.
10. Unknown inheritance **MUST** fail closed.
11. Redaction **MUST NOT** substitute for access prevention.
12. The implementer **MUST NOT** be the sole verifier.