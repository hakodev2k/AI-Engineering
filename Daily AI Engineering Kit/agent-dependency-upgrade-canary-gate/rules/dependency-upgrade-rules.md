# Dependency Upgrade Rules

## MUST
- Start from a clean Git working tree unless the user explicitly authorizes preserving unrelated changes.
- Identify the direct target dependency, current version, requested version, package manager, manifests, lockfiles, and affected runtime/build surface.
- Capture a baseline before editing: repository HEAD, manifest/lockfile hashes, dependency resolution output when available, and baseline verification results.
- Keep the first change limited to the requested dependency and mechanically required transitive changes.
- Record every changed direct dependency and explain why it changed.
- Run restore/install, build, tests, and topic-specific verification after the upgrade.
- Inspect the final Git diff and dependency graph before declaring success.
- Require explicit human approval before major-version upgrades, auth/security library changes, database-provider changes, runtime/framework upgrades, build-toolchain upgrades, production configuration changes, irreversible migrations, or changes affecting more than five direct dependencies.
- Stop on permission errors; never increase permissions silently.
- Preserve failure evidence under `.ai/dependency-upgrade-canary/`.

## MUST NOT
- Do not run bulk upgrade commands such as `dotnet outdated -u`, `npm update` across the repository, or equivalent mass-update operations unless explicitly scoped and approved.
- Do not delete or regenerate lockfiles merely to make resolution succeed.
- Do not suppress failing tests, downgrade analyzers, weaken security controls, or change production configuration to force verification to pass.
- Do not modify public API contracts, database schemas, deployment manifests, or unrelated source files unless required by the upgrade and separately approved when risky.
- Do not claim compatibility from a successful package restore alone.
- Do not retry the same failed action more than two times without new evidence or a changed hypothesis.

## SHOULD
- Prefer the smallest supported version satisfying the request over broad latest-version jumps.
- Prefer locked/reproducible restore modes where the ecosystem supports them.
- Read release notes or migration guides for major/runtime/security-sensitive upgrades before editing.
- Add or strengthen a focused regression test when the upgrade fixes a behavior defect or compatibility issue.
- Separate dependency changes from unrelated refactoring.
