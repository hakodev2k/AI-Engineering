# IPC and Component Security

## Purpose
Secure Android intents/providers/services and iOS app extensions, URL handlers, shared containers, and other inter-process or cross-app boundaries.

## When to use
Use when exposing components, sharing data between apps/extensions, or integrating OS services.

## Inputs
Component inventory, manifest/entitlements, caller requirements, shared data, authorization rules.

## Preconditions
Identify which components must be externally reachable and by whom.

## Context to inspect
Exported components, intent filters, providers, permissions, app groups, extensions, pasteboard/shared containers, serialization, and callback handlers.

## Core knowledge
IPC inputs are untrusted unless caller identity and authorization are explicitly established. Minimize exposed components and validate every external message.

## Procedure
1. Inventory IPC entry points.
2. Remove unintended exposure.
3. Apply platform access controls where available.
4. Validate caller identity when meaningful.
5. Validate message schema, identifiers, and file/URI access.
6. Recheck authorization before privileged effects.
7. Prevent confused-deputy behavior.
8. Test unauthorized callers and malformed messages.

## Decision points
Prefer private/internal components. Expose only narrow interfaces required for interoperability, with server validation for remote authority.

## Common failure patterns
Implicit exports, trusting extras, overly broad content providers, shared-container secret leakage, path traversal through URIs, and privileged proxy behavior.

## Verification
Invoke components from an unauthorized test application and verify safe rejection and data isolation.

## Expected output
A minimal IPC surface with explicit access controls and hostile-caller tests.

## Stop conditions
Escalate when platform identity guarantees are insufficient for the required trust decision.