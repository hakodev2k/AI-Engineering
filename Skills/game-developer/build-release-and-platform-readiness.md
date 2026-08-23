# Build Release and Platform Readiness

## Purpose
Produce reproducible game builds that satisfy target-platform packaging, configuration, performance, compliance, and release requirements.

## When to use
Use when adding platforms, preparing releases, diagnosing build-only defects, automating CI, or managing platform-specific configuration.

## Inputs
Target platforms, engine/toolchain versions, signing requirements, store/platform rules, build configurations, CI environment, and release criteria.

## Context to inspect
Inspect build scripts, dependency versions, platform defines, signing/secrets handling, asset packaging, native plugins, symbols, crash reporting, and artifact retention.

## Core knowledge
Editor success does not prove player-build correctness. Reproducible toolchains, explicit configuration, automated validation, symbols, and representative hardware testing reduce release risk. Signing credentials must remain outside source control.

## Procedure
1. Pin supported engine/toolchain/dependency versions.
2. Define release and development build profiles explicitly.
3. Automate clean builds in CI where practical.
4. Validate platform-specific plugins, permissions, manifests, and architectures.
5. Inject secrets/signing through secure build infrastructure.
6. Produce symbols and version metadata.
7. Run smoke, performance, save compatibility, and network tests on packaged builds.
8. Validate install/update/uninstall flows.
9. Retain reproducible artifacts and release metadata.
10. Perform platform/store compliance checks before submission.

## Decision points
Use platform-specific branches only when conditional configuration cannot remain maintainable. Prefer one reproducible pipeline with parameterized targets over manual release machines.

## Common failure patterns
Works-in-editor assumptions, unpinned SDKs, secrets in repository, missing symbols, platform code paths never tested, stale caches masking build problems, and manual undocumented release steps.

## Verification
Build from clean environment, install on representative devices, run release smoke tests, verify version/signature/symbols, and confirm artifact provenance.

## Expected output
A repeatable release pipeline producing validated platform-ready artifacts.

## Stop conditions
Stop when signing authority, required platform credentials, legal/store approvals, or mandatory hardware are unavailable.