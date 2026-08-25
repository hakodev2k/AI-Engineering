# Dependency Security

## Purpose
Manage security risk introduced by third-party libraries and transitive dependencies without destabilizing applications.

## When to use
Use during dependency selection, vulnerability triage, upgrades, release review, and supply-chain incidents.

## Inputs
Lockfiles, SBOM, advisories, reachability information, package metadata, release notes, tests, and runtime inventory.

## Context to inspect
Inspect direct/transitive dependency graphs, package sources, pinning, build scripts, runtime loading, and deployment artifacts.

## Core knowledge
A vulnerability's practical risk depends on affected version, reachability, exposure, exploitability, and compensating controls. Package integrity and provenance are separate from CVE status.

## Procedure
1. Build an accurate dependency inventory from resolved artifacts.
2. Identify affected versions and runtime exposure.
3. Determine whether vulnerable functionality is reachable.
4. Rank remediation by exploitability and business impact.
5. Prefer supported patched versions; assess breaking changes and transitive effects.
6. Validate package source, integrity, and maintainer/project health for new dependencies.
7. Test upgrades using unit, integration, and security regression tests.
8. Record temporary mitigations with expiry dates.
9. Remove unused dependencies and stale exceptions.

## Decision points
Patch immediately when exploitation is credible and exposure high; use compensating controls only when upgrade risk is temporarily greater. Forking creates long-term maintenance ownership and needs explicit justification.

## Common failure patterns
Blindly equating scanner severity with application risk, ignoring transitive packages, indefinite suppressions, unpinned builds, and upgrading without compatibility tests.

## Verification
Confirm resolved production artifact contains patched versions, relevant exploit path is closed, and tests pass.

## Expected output
A risk-based dependency remediation record and verified artifact state.

## Stop conditions
Escalate active exploitation, compromised package provenance, or upgrades requiring unsupported platform changes.