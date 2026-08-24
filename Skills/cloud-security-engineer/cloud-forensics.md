# Cloud Forensics

## Purpose
Collect and analyze defensible cloud evidence to reconstruct security events without unnecessarily altering the environment.

## When to use
Use during cloud incidents, insider investigations, compromised workload analysis, or post-incident reconstruction.

## Inputs
Incident scope, account identifiers, audit logs, snapshots, object versions, network logs, identity events, and evidence requirements.

## Context to inspect
Inspect provider log retention, immutable storage, snapshot capabilities, instance metadata, serverless versions, container images, and time sources.

## Core knowledge
Cloud evidence spans provider control plane and workload artifacts. Maintain provenance, timestamps, hashes where applicable, and chain-of-custody requirements.

## Procedure
1. Define investigative questions.
2. Record collection authority and scope.
3. Preserve authoritative cloud audit logs.
4. Snapshot relevant disks, objects, images, and configurations.
5. Record metadata and collection timestamps.
6. Work from copies when possible.
7. Correlate identity, control-plane, network, and workload events.
8. Distinguish fact from inference.
9. Preserve analysis artifacts and hashes where useful.
10. Produce a reproducible timeline.

## Decision points
Prioritize volatile evidence first. Avoid live-host interaction when snapshot or provider-side evidence can answer the question with less contamination.

## Common failure patterns
Changing resources before capture, timezone confusion, missing cross-account logs, relying on one telemetry source, and undocumented evidence handling.

## Verification
A second analyst should be able to trace conclusions to preserved evidence and reproduce key timeline steps.

## Expected output
Evidence inventory, defensible timeline, findings, confidence levels, and unresolved questions.

## Stop conditions
Stop when collection exceeds authorization, legal hold applies, or evidence handling requires specialist forensic/legal procedures.