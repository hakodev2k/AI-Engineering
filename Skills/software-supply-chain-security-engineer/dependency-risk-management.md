# Dependency Risk Management

## Purpose
Control security and continuity risks introduced by third-party libraries, packages, frameworks, and transitive dependencies without reducing dependency management to vulnerability counting.

## When to use
Use when adding dependencies, reviewing dependency posture, responding to advisories, or defining dependency policy.

## Inputs
Manifests, lockfiles, package sources, SBOMs, vulnerability data, maintenance history, licenses, runtime exposure, and business criticality.

## Context to inspect
Identify direct and transitive dependencies, package managers, registries, update automation, vendored code, build-time-only packages, and where dependencies execute.

## Core knowledge
Risk depends on exploitability, reachability, privilege, maintainer health, update behavior, package provenance, and operational replaceability. CVSS alone is insufficient.

## Procedure
1. Inventory dependencies from authoritative manifests and resolved graphs.
2. Classify runtime, build, test, and development exposure.
3. Verify registry origin and namespace ownership.
4. Review known vulnerabilities and reachable vulnerable functionality.
5. Evaluate maintainer activity, release practices, ownership changes, and suspicious package behavior.
6. Identify unpinned, abandoned, duplicated, or unnecessary dependencies.
7. Prioritize removal, upgrade, isolation, or compensating controls.
8. Test upgrades against compatibility and security requirements.
9. Automate recurring monitoring with controlled update workflows.
10. Record exceptions with expiry and owner.

## Decision points
Remove a dependency when its value is small relative to attack surface. Patch immediately when exploitation is credible and exposure is material; otherwise schedule safely with compensating controls. Fork only when ownership and long-term maintenance are justified.

## Common failure patterns
Blindly accepting automated upgrades; ignoring transitive packages; treating dev dependencies as harmless; pinning forever; suppressing alerts without evidence; using public packages where an internal namespace can be confused.

## Verification
Re-resolve dependencies, run security and regression tests, verify lockfiles, and confirm deployed artifacts contain the intended versions.

## Expected output
A prioritized dependency risk assessment with verified remediation and documented exceptions.

## Stop conditions
Escalate on suspected malicious packages, unexplained maintainer takeover, critical incompatible upgrades, or dependencies whose provenance cannot be established.