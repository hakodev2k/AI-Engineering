# Privacy, Permissions, and Data Protection

## Purpose
Minimize sensitive-data exposure and implement iOS permission flows that are technically correct, explainable, and aligned with actual feature use.

## When to use
Use for camera, photos, contacts, location, microphone, tracking, health, Bluetooth, or privacy-manifest changes.

## Inputs
Feature purpose, data inventory, permission requirements, retention/sharing policy, SDK list.

## Context to inspect
Info.plist usage descriptions, entitlements, privacy manifests, third-party SDK behavior, storage, analytics, network payloads.

## Core knowledge
Request permissions at contextual moments and only for necessary scope. OS authorization is separate from consent, legal basis, retention, and server-side governance.

## Procedure
1. Inventory collected, derived, stored, and transmitted data.
2. Remove collection not needed for product behavior.
3. Map each capability to required entitlement/permission.
4. Write accurate user-facing purpose text.
5. Request access just-in-time and handle every authorization state.
6. Provide degraded behavior when reasonable.
7. Minimize retention and redact telemetry.
8. Audit SDK data access and required manifests.
9. Validate deletion/export flows when applicable.

## Decision points
Prefer limited/scoped authorization when it satisfies the feature. Avoid permission prompts when a system picker can provide required access without broad grants.

## Common failure patterns
Prompting on launch, misleading usage descriptions, assuming denial is permanent, hidden SDK collection, and sensitive data in logs/backups.

## Verification
Test fresh install, deny, limited, restricted, revoked, and settings-return flows; review manifests and captured network/log output.

## Expected output
Data-flow inventory, minimal permission set, compliant declarations, and tested degraded states.

## Stop conditions
Escalate legal/policy ambiguity or SDK behavior that cannot be independently characterized.