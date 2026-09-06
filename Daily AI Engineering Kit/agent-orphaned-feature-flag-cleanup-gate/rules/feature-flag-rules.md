# Feature Flag Cleanup Rules

## MUST
- Establish the flag owner, lifecycle state, expected retired behavior, and all repository references before editing.
- Preserve the behavior selected by `expected_behavior` when replacing a retired flag branch.
- Run repository-native tests for every changed execution path.
- Re-scan the repository after edits and require zero non-allowlisted references before declaring cleanup complete.
- Keep evidence that distinguishes facts, hypotheses, decisions, and unresolved risk.
- Require independent verification after implementation.
- Require explicit human approval before deleting production flag configuration, changing production defaults, changing a public API contract, deleting data, changing secrets, modifying infrastructure, or performing a large dependency upgrade.

## MUST NOT
- Infer the winning branch from the flag name or current local default.
- Delete both branches without proving which behavior must remain.
- Treat an expired date as proof that a flag is safe to remove.
- Remove telemetry, authorization, validation, or rollback behavior merely because it is adjacent to flag code.
- Delete production configuration or remote provider state automatically.
- Force push, rewrite history, deploy, or change production settings as part of this package.
- Silence failing tests or broaden allowlists to obtain a pass.
- Retry deterministic verification failures indefinitely.

## SHOULD
- Remove dead branch-specific tests only after equivalent tests cover the retained behavior.
- Remove obsolete flag adapters, configuration bindings, and metrics when their only purpose was the retired flag.
- Keep registry tombstone metadata (`owner`, `retired_at`, `expected_behavior`) until the organization retention policy permits deletion.
- Prefer one flag cleanup per change set when practical so rollback and review remain clear.
