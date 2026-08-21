# Dependency Upgrade Safety Rules

## MUST
- Record current and target versions before editing dependency files.
- Capture direct and relevant transitive dependency deltas.
- Link high-risk upgrade claims to evidence from release notes, migration guides, advisories, or repository usage.
- Keep compatibility edits scoped to behaviors required by the upgrade.
- Run relevant restore/build/tests after implementation.
- Preserve rollback information for every modified dependency declaration or lockfile.
- Require human approval for major-version jumps with breaking changes, framework/runtime target changes affecting multiple apps, database migrations, security/auth changes, or production configuration changes.
- Report unresolved risk explicitly.

## MUST NOT
- Upgrade unrelated dependencies opportunistically unless explicitly included in the manifest.
- Disable, skip, delete, or weaken tests merely to make the upgrade pass.
- Suppress warnings/errors without documented evidence that suppression is safe.
- Change public API/event/database contracts unless explicitly required and approved.
- Execute production deployment, schema migration, secret changes, or destructive data operations without explicit human approval.
- Force push or rewrite Git history.
- Assume semantic-version compatibility proves runtime compatibility.

## SHOULD
- Prefer the smallest supported version jump that satisfies the requirement.
- Separate compatibility refactors from unrelated cleanup.
- Add regression tests around upstream behavior changes that existing tests do not cover.
- Prefer deterministic package-manager/build output over LLM inference for dependency state.
- Verify generated code and lockfiles when the ecosystem uses them.
- Compare before/after runtime defaults for libraries known to change defaults between versions.
