# Platform Permissions

## Purpose
Apply least privilege to camera, microphone, location, contacts, storage, Bluetooth, notifications, and other OS capabilities.

## When to use
Use when adding, changing, or auditing runtime permissions and entitlements.

## Inputs
Feature requirements, platform manifests, entitlement files, privacy disclosures, data flows.

## Preconditions
Map each permission to a concrete user-visible requirement.

## Context to inspect
Android manifest, iOS entitlements and usage descriptions, runtime requests, background modes, SDK-added permissions, and fallback behavior.

## Core knowledge
Permissions expand attack surface and privacy impact. Request the minimum scope at the moment of need and design graceful behavior when denied or revoked.

## Procedure
1. Inventory declared permissions and entitlements.
2. Trace each to a feature and data flow.
3. Remove unused or transitive permissions.
4. Choose least-privileged scope and duration.
5. Request contextually rather than at startup.
6. Handle denial, revocation, and restricted states.
7. Audit SDK manifest merging.
8. Test background behavior and OS-version differences.

## Decision points
Prefer scoped APIs over broad storage/location access. Avoid background permission unless the feature genuinely requires it and risk is justified.

## Common failure patterns
Permission creep, startup permission walls, hidden SDK permissions, broad storage access, assuming grants persist, and broken denial paths.

## Verification
Compare final packaged manifests/entitlements with approved requirements and test denied/revoked states on supported OS versions.

## Expected output
A minimal permission set with rationale, safe runtime handling, and verified package configuration.

## Stop conditions
Escalate when a dependency requires unjustified privilege or product requirements conflict with platform/privacy policy.