# Cloud Forensics

## Purpose
Investigate cloud compromise using control-plane, identity, workload, storage, and network evidence while preserving provider-native context.

## When to use
Use for suspicious cloud identities, unauthorized configuration changes, workload compromise, exposed storage, or data-access investigations.

## Inputs
Provider logs, account/subscription/project identifiers, identities, resource inventory, time window, and incident indicators.

## Preconditions
Confirm tenant authority, retention windows, export permissions, and legal constraints.

## Context to inspect
Audit/control-plane logs, IAM changes, API calls, object access, workload logs, snapshots, network telemetry, temporary credentials, and cross-account trust.

## Core knowledge
Cloud evidence is highly distributed and retention-sensitive. Identity, region, service, and API semantics matter more than host-centric assumptions.

## Procedure
1. Freeze the investigative time window and preserve expiring logs.
2. Map identities, roles, tokens, accounts, and trust relationships.
3. Review control-plane changes and authentication events.
4. Trace resource creation, modification, access, and deletion.
5. Correlate workload, storage, and network events.
6. Snapshot volatile workloads or disks where authorized.
7. Identify credential use across regions/services.
8. Build an evidence-backed attack path and scope.

## Decision points
Prefer provider audit evidence for control-plane actions; use workload artifacts for guest-level execution. Separate compromised identity from compromised workload.

## Common failure patterns
Ignoring region-specific logs, missing short-lived credentials, using current IAM state as historical truth, and failing to preserve logs before retention expiry.

## Verification
Cross-check major actions across identity, control-plane, and workload evidence.

## Expected output
Cloud incident timeline, affected identities/resources, attack path, and evidence gaps.

## Stop conditions
Stop when tenant scope is unclear, exports exceed authorization, or provider retention prevents defensible conclusions.