# Engineering Rules

## MUST
- Every new direct dependency, executable package invocation (`npx`, `pipx`, package-manager exec), and dependency version change MUST pass the guard before execution.
- Dependency identity MUST be normalized to ecosystem + canonical package name + exact version before approval, unless the package is explicitly pre-approved under a documented floating-version policy.
- Registry lookup MUST use the authoritative registry configured for the project; registry errors MUST fail closed.
- Non-registry git, URL, archive, and local-path sources MUST be denied by default and require a separate explicit approval path.
- Fresh package versions inside the configured cooldown MUST require explicit human approval unless pre-approved.
- npm deprecated versions and PyPI releases whose files are all yanked MUST be denied when the corresponding policy flags are enabled.
- Installation MUST use the safest supported mode, disabling lifecycle scripts and non-registry sources unless they are explicitly required and approved.
- Post-install resolution MUST match the approved package identity/version.
- Lockfile/integrity/hash evidence MUST be preserved with the decision record.
- Security failures MUST NOT be converted into ordinary retry loops.
- High-risk exceptions MUST record approver, reason, scope, and expiration.

## MUST NOT
- MUST NOT treat "package exists" as proof the package is trustworthy.
- MUST NOT treat model confidence, generated citations, popularity, stars, or download count as sufficient approval evidence.
- MUST NOT install a package merely to determine whether it is safe to install.
- MUST NOT execute generated setup/install scripts from an unreviewed dependency or repository before the gate.
- MUST NOT bypass the gate through shell aliases, nested agents, generated scripts, Docker build steps, CI jobs, or package-manager exec commands.
- MUST NOT silently substitute a similarly named package when the requested package fails validation.
- MUST NOT claim npm provenance proves absence of malicious code; it proves attributable build/source information when valid.
- MUST NOT expose registry credentials, private tokens, or environment secrets in decision logs.

## SHOULD
- SHOULD maintain an approved dependency catalog for stable, repeatedly used packages.
- SHOULD use a cooldown for newly published versions when immediate adoption is not necessary.
- SHOULD prefer packages with verifiable source repositories and reproducible provenance/signatures where the ecosystem supports them.
- SHOULD pin exact versions for agent-introduced dependencies and rely on lockfiles with integrity hashes.
- SHOULD review newly introduced transitive dependencies and install-script behavior.
- SHOULD run the gate in local agent hooks and CI so prompt-level rules are backed by deterministic enforcement.
- SHOULD measure guarded-install coverage and fail the build when an install path is discovered outside the gate.
