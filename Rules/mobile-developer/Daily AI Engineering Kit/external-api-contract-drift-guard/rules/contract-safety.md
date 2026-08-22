# Contract Safety Rules

## MUST
- Generate a deterministic contract diff before semantic classification.
- Keep evidence for every breaking, potentially-breaking, or unknown drift item.
- Map changed operations/types to repository consumers before editing.
- Preserve existing supported behavior unless the task explicitly removes it.
- Run targeted contract tests and relevant regression tests after implementation.
- Record unresolved provider assumptions in the final verification result.
- Require explicit human approval for production auth/config changes, breaking public contracts, destructive migrations, infrastructure changes, or large major-version dependency upgrades.

## MUST NOT
- Do not copy secrets, tokens, cookies, or production credentials into snapshots or reports.
- Do not treat added fields or enum values as automatically safe.
- Do not disable certificate, auth, schema, or input validation to make compatibility tests pass.
- Do not edit generated clients manually when the repository has a reproducible generation process unless explicitly required.
- Do not delete old-version adapters without support-lifecycle evidence.
- Do not deploy or change production routing from this workflow without explicit human approval.
- Do not retry the same deterministic failure indefinitely.

## SHOULD
- Prefer tolerant-read/strict-write patterns where appropriate.
- Isolate provider-specific transformations at integration boundaries.
- Keep raw snapshots immutable and generate normalized copies separately.
- Add regression fixtures for provider edge cases discovered during migration.
- Prefer reversible rollout strategies for high-risk changes.
