# Identity Lifecycle Management

## Purpose
Control identity creation, changes, suspension, reactivation, and deletion so access follows authoritative business state.

## When to use
Use for joiner-mover-leaver processes, HR-driven provisioning, contractor lifecycle, customer account lifecycle, or orphan-account remediation.

## Inputs
Authoritative sources, identity populations, employment/customer states, applications, entitlements, SLAs, retention rules, and exception processes.

## Context to inspect
Inspect source-of-truth events, provisioning connectors, account correlation, entitlement assignment, disable/delete behavior, rehire/reactivation, and downstream propagation.

## Core knowledge
Lifecycle security depends on timely state propagation and deterministic correlation. Deprovisioning is as important as provisioning; deletion may conflict with audit and retention requirements.

## Procedure
1. Define lifecycle states and authoritative transitions.
2. Map each state to account and access behavior.
3. Establish stable identity correlation keys.
4. Automate provisioning from authoritative events where feasible.
5. Separate account disablement from data deletion.
6. Remove or suspend entitlements promptly on exit or role change.
7. Handle rehire, duplicate, contractor, and leave-of-absence cases explicitly.
8. Reconcile source and target systems regularly.
9. Alert on failed or delayed lifecycle actions.
10. Measure provisioning and deprovisioning SLAs.

## Decision points
Use event-driven lifecycle for time-sensitive access changes; scheduled reconciliation remains necessary to detect drift. Disable first when retention or recovery needs make immediate deletion unsafe.

## Common failure patterns
Email address as immutable identity key, manual offboarding, orphan accounts, delayed group removal, duplicate accounts, silent connector failures, and reactivation restoring obsolete access.

## Verification
Run lifecycle scenarios end to end and reconcile expected versus actual accounts and entitlements across representative systems.

## Expected output
A lifecycle state model, automation flow, exception handling, reconciliation controls, SLAs, and audit evidence.

## Stop conditions
Escalate when no authoritative source exists, legal retention conflicts are unresolved, or target systems cannot reliably disable access.