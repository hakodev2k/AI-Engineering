# Automation Platform Version and Dependency Management

## Purpose
Control library, collection, API, schema, and platform-version changes that can silently alter network automation behavior.

## When to use
Use for dependency upgrades, device OS expansion, controller upgrades, Python/runtime changes, and collection/model revisions.

## Inputs
Dependency manifests, supported platform matrix, changelogs, API/model versions, tests, and deployment environments.

## Context to inspect
Lock files, container images, CI runners, Ansible collections, SDKs, parser templates, YANG/OpenConfig revisions, and deprecations.

## Core knowledge
Network automation depends on both software and remote platform behavior. Reproducibility requires controlled versions plus compatibility testing across supported device releases.

## Procedure
1. Inventory runtime and remote dependencies.
2. Define supported version matrix and ownership.
3. Pin or constrain dependencies deliberately.
4. Review release notes for behavioral/security changes.
5. Run unit, contract, render, and lab regression tests.
6. Test representative device/controller versions.
7. Roll out dependency changes separately from unrelated logic when possible.
8. Canary production automation.
9. Monitor error/diff changes.
10. Update compatibility documentation and retire unsupported versions deliberately.

## Decision points
Pin exact versions for reproducible critical runtimes; allow bounded ranges only with continuous tests. Upgrade quickly for severe security issues but preserve canary and rollback controls.

## Common failure patterns
Floating latest dependencies, controller API upgrades without contract tests, parser breakage after OS changes, and combining dependency plus workflow redesign in one rollout.

## Verification
Rebuild from clean environment, run compatibility matrix, compare generated outputs, and verify canary behavior.

## Expected output
Version policy, compatibility matrix, tested upgrade, rollback artifact, and deprecation plan.

## Stop conditions
Stop when a dependency changes network semantics unexpectedly or supported platform coverage cannot be tested.