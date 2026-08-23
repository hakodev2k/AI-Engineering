# Frontend Dependency Management

## Purpose
Control third-party package risk, bundle cost, compatibility, upgrade cadence, and supply-chain exposure while keeping frontend development productive.

## When to use
Use when adding dependencies, planning upgrades, responding to advisories, reducing bundle weight, or resolving dependency conflicts.

## Inputs
Package manifest/lockfile, dependency graph, security advisories, bundle analysis, runtime/browser targets, and maintenance policy.

## Context to inspect
Direct/transitive packages, licenses, release cadence, peer dependencies, install scripts, duplicate versions, abandoned packages, and usage surface.

## Core knowledge
Every dependency adds code, transitive trust, update work, and potential runtime/bundle cost. Lockfiles improve reproducibility but do not remove supply-chain risk. Prefer mature, narrowly scoped dependencies when native/platform code is insufficient.

## Procedure
1. Define the capability required before selecting a package.
2. Check whether platform/framework functionality already satisfies it.
3. Evaluate maintenance, adoption, release history, license, security posture, and package size.
4. Inspect transitive dependency and install-script risk.
5. Prototype the smallest integration.
6. Pin/restrict versions according to repository policy and commit the lockfile.
7. Add automated dependency/security checks.
8. Upgrade in bounded increments with release-note review.
9. Test runtime, build, and bundle impact.
10. Remove unused packages and stale compatibility layers.

## Decision points
Vendor or implement small stable functionality when dependency risk exceeds maintenance cost. Delay major upgrades when migration risk is high, but record debt and security implications explicitly.

## Common failure patterns
Adding libraries for trivial helpers, ignoring transitive code, deleting lockfiles, automatic major upgrades without tests, abandoned dependencies, and retaining packages after usage disappears.

## Verification
Clean install is reproducible, build/tests pass, bundle impact is understood, security/license checks satisfy policy, and no obsolete dependency remains.

## Expected output
A justified dependency decision or upgrade with reproducibility, risk assessment, and verification evidence.

## Stop conditions
Escalate critical advisories without safe upgrade paths, incompatible licenses, suspicious package provenance, or upgrades requiring unapproved breaking changes.