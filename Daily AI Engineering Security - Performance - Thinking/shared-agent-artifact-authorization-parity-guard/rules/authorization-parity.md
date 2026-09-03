# Authorization Parity Rules

- Every path that can mutate a protected shared/template agent artifact MUST enforce the same mandatory resource-level controls.
- UI flags, client-side disabled controls, documentation, and route naming MUST NOT be treated as authorization boundaries.
- Session edit permission MUST NOT imply permission to modify a shared/template artifact unless an explicit protected-resource authorization check grants it.
- Shared/template executable artifacts MUST be immutable to ordinary scoped/session users by default.
- Alternate paths such as upload, import, clone, restore, migration, bulk update, MCP tool calls, and administrative APIs MUST be included in the mutation-path inventory.
- Downstream services MUST preserve caller scope or independently re-authorize the protected mutation; use of a broad service credential MUST NOT erase caller restrictions.
- Denied protected mutations MUST produce an auditable event without logging secrets.
- Intentional modification of shared executable templates SHOULD require explicit human/admin approval and a new immutable revision rather than in-place mutation.
- Security verification MUST include negative tests for every inventoried mutation path.
- A failing parity check MUST block release; controls MUST NOT be disabled merely to restore functionality.
