# Dependency and Supply Chain Rules

## Purpose
Control security, compatibility, maintenance, and bundle risks introduced by frontend dependencies.

## Scope
npm packages, Angular ecosystem libraries, build plugins, transitive dependencies, and upgrades.

## MUST
- Review new dependencies for maintenance status, license, security history, bundle/runtime impact, and necessity.
- Pin and update dependencies through the project's approved lockfile and reproducible build process.
- Assess Angular/framework major upgrades for breaking changes and migration requirements before adoption.
- Triage known vulnerabilities by exploitability and application exposure, not severity label alone.

## MUST NOT
- Disable dependency/security scanning merely to unblock delivery.
- Add abandoned or opaque packages to critical paths without documented risk acceptance.
- Perform large framework/dependency migrations without human approval and rollback strategy.

## SHOULD
- Prefer platform or Angular capabilities over third-party packages when capability and maintenance cost are comparable.

## Exceptions
Urgent dependency overrides require reason, evidence, owner, expiry/review date, and approval proportional to risk.

## Verification
Inspect lockfiles, SBOM/scanner output, licenses, bundle stats, upgrade tests, and dependency diffs.