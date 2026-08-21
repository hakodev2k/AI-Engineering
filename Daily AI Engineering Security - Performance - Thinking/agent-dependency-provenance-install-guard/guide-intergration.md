# Integration Guide

## Purpose
Integrate the dependency gate at the execution boundary so AI instructions cannot bypass it merely by changing wording or delegating to another agent.

## 1. Install package files
Keep `config/policy.json`, `scripts/dependency_guard.py`, and the documentation directories in a location readable by the agent runtime. Python 3.10+ is sufficient for the guard and it has no third-party runtime dependency.

## 2. Configure policy
Start with fail-closed defaults. Populate `approved_packages` only with dependencies your team intentionally trusts. Keep new direct dependencies pinned. Adjust `minimum_package_age_hours` based on risk appetite; shortening it trades reaction time for freshness. Treat an override as an exception record, not as a silent configuration edit.

## 3. Intercept install-capable actions
The runtime should classify these as privileged dependency actions: manifest additions, npm/pnpm/yarn/bun install/add/exec/npx, pip/pipx install/run, generated bootstrap scripts, Docker build steps that install packages, CI modifications that install packages, and shell commands containing equivalent package-manager operations.

Before execution, invoke:

`python scripts/dependency_guard.py --policy config/policy.json --ecosystem npm --spec 'example@1.2.3'`

or:

`python scripts/dependency_guard.py --policy config/policy.json --ecosystem pypi --spec 'example==1.2.3'`

Exit codes: `0=allow`, `2=human review`, `3=deny`, `4=technical/error`. Only `0` proceeds automatically.

## 4. Human approval
For exit 2, present the recorded evidence. Approval must bind to an exact package/version and reason. If approving a fresh package, rerun with `--human-approved`; retain the original review record and approval evidence. Do not make `--human-approved` available to autonomous subagents without a real external authorization check.

## 5. Safe package-manager execution
For npm, use the newest supported CLI and disable lifecycle scripts by default. Where supported, restrict git/remote/local install sources. GitHub's 2026 npm hardening work adds explicit source controls and moves toward safer defaults, but runtime enforcement should still be explicit. After resolution, use `npm audit signatures` where applicable and capture its result. Do not interpret valid provenance as proof the code is benign.

For Python, prefer a virtual environment/container for first resolution, exact versions, lockfiles/requirements with hashes, and trusted index configuration. Querying PyPI before install prevents nonexistent-name execution but does not replace malware/advisory review.

## 6. CI enforcement
Add a CI job that scans changed manifests/lockfiles and requires a corresponding decision record for every newly introduced direct dependency. Run `python -m unittest tests/test_dependency_guard.py`. Treat missing evidence as failure.

## 7. Agent rules
Copy or reference `rules/engineering-rules.md` in the runtime's policy layer. Prompt instructions are advisory; the actual package-manager tool/shell wrapper must enforce the hook.

## 8. Logging and privacy
`audit_log` contains package names, versions, decisions, timestamps, and public metadata. It must not contain registry tokens, Authorization headers, private environment variables, or private package metadata unless your storage is approved for that data.

## 9. Failure handling
Registry 404 -> deny. Registry timeout/server error -> fail closed; one bounded retry only. Fresh package -> review. Deprecated/yanked -> deny under default policy. Direct URL/git/local path -> deny default. Post-install identity mismatch -> reject and revert/isolate changes. Security verification failure -> no automatic retry with weaker settings.

## 10. Validation
Run unit tests, then exercise an isolated project with: a known exact npm package, a fake nonexistent package, a package younger than cooldown (fixture/mocked test), a git URL, an unpinned package, and an exact PyPI package. Verify package-manager execution happens only for allow decisions.
