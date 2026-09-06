# Package Release and Distribution

## Purpose
Release SDKs, CLIs, and developer tooling through reliable package channels with reproducible artifacts, clear versioning, and fast rollback paths.

## When to use
Use when publishing language SDKs, command-line tools, plugins, or helper libraries.

## Inputs
Source repository, package registries, supported runtimes, build pipeline, signing policy, changelog, semantic-versioning policy, test matrix, and release approvals.

## Context to inspect
Inspect package metadata, dependency constraints, CI/CD, provenance, signing, release notes, installation documentation, deprecation policy, and previous release incidents.

## Core knowledge
Developer tooling releases create a supply-chain and compatibility boundary. Artifacts should be built reproducibly, tested in the same form users install, attributable to source, and versioned according to actual compatibility impact.

## Procedure
1. Determine release scope and compatibility impact.
2. Update version and changelog consistently.
3. Run unit, integration, compatibility, and packaging tests.
4. Build artifacts in a controlled CI environment.
5. Generate provenance or signatures where supported.
6. Test installation from built artifacts in clean environments.
7. Publish to staging or preview channels when available.
8. Verify metadata, dependencies, and package contents.
9. Publish the release and tag the source revision.
10. Run post-publish smoke tests from the public registry.
11. Monitor installation and runtime failures.
12. Maintain a rollback, yank, or urgent-patch procedure.

## Decision points
Use a major version for incompatible public-surface changes, minor for backward-compatible features, and patch for compatible fixes according to ecosystem norms. Prefer pre-release channels for uncertain or ecosystem-wide changes.

## Common failure patterns
Testing source but not packaged artifacts, accidental dependency broadening, missing files, unsigned or unverifiable artifacts, inconsistent versions across SDKs, and releases with no rollback plan.

## Verification
Install from the actual registry on supported runtimes, compare artifact contents to expected files, verify signatures/provenance, run smoke tests, and confirm documentation references the released version.

## Expected output
A verified package release with changelog, provenance, compatibility evidence, installation checks, and rollback instructions.

## Stop conditions
Stop when tests are failing, package ownership is unclear, signing/provenance requirements are unmet, or a breaking change lacks migration documentation.