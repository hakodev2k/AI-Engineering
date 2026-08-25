# Fleet Device Lifecycle

## Purpose
Operate large edge fleets from provisioning through retirement with controlled identity, configuration, health, and ownership.

## When to use
Use when onboarding devices, managing fleets, rotating ownership, or designing lifecycle automation.

## Inputs
Device classes, fleet size, identity model, configuration sources, support procedures, retirement policy.

## Context to inspect
Inspect manufacturing enrollment, certificates, inventories, configuration channels, update agents, health records, and decommission workflows.

## Core knowledge
Fleet lifecycle requires unique identity, trustworthy enrollment, inventory accuracy, configuration versioning, staged changes, remote recovery, and secure retirement.

## Procedure
1. Define device identity and ownership lifecycle.
2. Establish authenticated enrollment.
3. Record hardware, software, location, and capability inventory.
4. Version desired configuration separately from observed state.
5. Detect drift and stale devices.
6. Segment fleets into safe rollout rings.
7. Define replacement and ownership-transfer procedures.
8. Revoke credentials and wipe sensitive state at retirement.
9. Preserve audit evidence.
10. Test lost, duplicated, cloned, and factory-reset device scenarios.

## Decision points
Centralize desired state when fleet consistency matters; permit bounded local overrides when site autonomy is required.

## Common failure patterns
Shared credentials, stale inventory, unmanaged configuration drift, unrecoverable enrollment, retired devices retaining trust.

## Verification
Demonstrate enrollment, configuration changes, credential rotation, replacement, and retirement against representative devices.

## Expected output
A controlled lifecycle process with inventory, trust, configuration, recovery, and retirement rules.

## Stop conditions
Stop if device identity cannot be made unique or retirement cannot revoke access reliably.