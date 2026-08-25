# Dependency and SBOM Management

## Purpose
Maintain trustworthy visibility and vulnerability response for firmware libraries, RTOS components, vendor SDKs, binary blobs, toolchains, and generated dependencies.

## When to use
Use during dependency adoption/upgrades, release preparation, vulnerability response, supplier review, and long-lived product maintenance.

## Inputs
Build manifests, lockfiles, vendor SDKs, source/binary components, licenses, version metadata, vulnerability feeds, support windows, and release artifacts.

## Preconditions
Inventory what actually ships in each firmware variant, not only top-level declared packages.

## Context to inspect
Static libraries, copied source, submodules, generated code, binary blobs, bootloader, RTOS, crypto/TLS stacks, compiler runtime, wireless stacks, and supplier patches.

## Core knowledge
Embedded dependencies are often vendored or binary and invisible to conventional package scanners. Version presence does not equal vulnerability applicability; configuration, reachability, and backported patches matter. An SBOM must correspond to a concrete release artifact.

## Procedure
1. Enumerate all shipped first- and third-party components.
2. Capture supplier, version/commit, hash, license, source location, and patch state.
3. Generate or maintain an SBOM per release artifact/variant.
4. Record binary-only provenance and supplier support contacts.
5. Monitor vulnerabilities for security-critical dependencies.
6. Triage findings by affected code, configuration, reachability, attacker prerequisites, and compensating controls.
7. Prefer supported versions and minimize unnecessary features/modules.
8. Test upgrades against timing, memory, protocol, and hardware constraints.
9. Track backported fixes explicitly rather than misrepresenting upstream version.
10. Define end-of-support risk and replacement plans for critical components.
11. Verify SBOM against final linked image/map where feasible.

## Decision points
Upgrade to upstream releases when compatibility risk is manageable; backport narrowly when certification or hardware constraints make major upgrades unsafe. Replace binary-only dependencies when vulnerability response and provenance are inadequate for product risk.

## Common failure patterns
SBOM from source tree rather than final firmware; missing bootloader/vendor blobs; false positives closed solely by version string; untracked local patches; unsupported crypto/network stack; dependency updates bypassing target performance tests.

## Verification
Compare SBOM entries with linker/map/build outputs, sample hashes, confirm vulnerability triage evidence, rebuild with upgraded components, and verify no undocumented dependencies enter release artifacts.

## Expected output
Release-specific SBOM, dependency inventory, vulnerability decisions, upgrade/backport changes, and support-risk register.

## Stop conditions
Escalate when critical binary provenance is unknown, a supplier cannot provide vulnerability/fix information, licensing blocks required remediation, or a critical vulnerability has no safe patch path.