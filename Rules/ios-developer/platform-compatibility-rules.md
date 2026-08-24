# Platform Compatibility Rules

## Purpose
Maintain correct behavior across supported iOS versions, devices, orientations, capabilities, and API availability.

## Scope
Deployment targets, availability checks, device capabilities, deprecations, layouts, and OS-specific behavior.

## MUST
- APIs newer than the deployment target MUST be protected by valid availability handling.
- Supported-device behavior MUST be tested on representative screen sizes and OS versions.
- Capability-dependent features MUST detect capability rather than infer it from device names.
- Deployment-target increases and removal of supported devices MUST be explicit product/release decisions.
- Deprecated APIs on critical paths MUST have a migration assessment before they become operational risk.

## MUST NOT
- MUST NOT use OS-version string parsing when platform availability APIs provide the contract.
- MUST NOT assume simulator behavior proves hardware-dependent functionality.
- MUST NOT silently break older supported OS versions through dependency upgrades.

## SHOULD
- Centralize compatibility shims with clear retirement conditions.
- Prefer adaptive layouts and system capabilities over device-specific branching.

## Exceptions
Known compatibility gaps require documented affected population, mitigation, approval, and release notes where user impact is material.

## Verification
Build against the minimum deployment target, run a device/OS test matrix, inspect availability annotations, test hardware features on devices, and review dependency minimum-version changes.