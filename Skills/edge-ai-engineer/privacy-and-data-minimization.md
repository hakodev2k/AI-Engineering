# Privacy and Data Minimization

## Purpose
Design edge AI data flows that minimize collection, retention, transmission, and exposure of sensitive sensor data while preserving required product functionality and diagnostic capability.

## When to use
Use for camera, audio, biometric, location, behavioral, or other sensitive edge workloads; when adding telemetry; or when deciding what data can leave the device.

## Inputs
Data inventory, product requirements, privacy policy, regulatory constraints, retention needs, cloud interfaces, telemetry design, and threat model.

## Preconditions
Classify data sensitivity and define legitimate processing purposes before implementing collection.

## Context to inspect
Raw sensor capture, local caches, feature embeddings, inference outputs, logs, crash dumps, telemetry payloads, upload queues, identifiers, and deletion behavior.

## Core knowledge
On-device inference can reduce exposure but does not automatically make a system private. Derived embeddings, metadata, and model outputs may still be sensitive. Data minimization requires purpose limitation, short retention, bounded caches, access controls, and explicit deletion semantics.

## Procedure
1. Inventory every datum created from sensor capture through telemetry.
2. Classify sensitivity, purpose, owner, retention, and transmission rules.
3. Remove data that is not necessary for a defined product or operational purpose.
4. Prefer local transformation and aggregation before transmission.
5. Use ephemeral buffers for raw inputs when persistence is unnecessary.
6. Bound diagnostic capture by trigger, duration, and authorization.
7. Redact or hash identifiers only when the transformed value still meets privacy policy.
8. Encrypt sensitive data at rest and in transit where storage/transmission is justified.
9. Implement deletion and cache-expiry behavior that includes failed-upload queues and backups under system control.
10. Review telemetry and crash reports for accidental sensitive payloads.
11. Test privacy behavior during offline accumulation and incident diagnostics.

## Decision points
Prefer aggregate metrics over raw samples. Persist exemplars only when diagnostic value clearly outweighs privacy risk and policy permits it. Avoid sending data to cloud merely because bandwidth is available.

## Common failure patterns
Raw frames in debug logs, indefinite retry caches, embeddings treated as anonymous by default, identifiers in metric labels, and retention rules implemented only server-side.

## Verification
Inspect device storage and network traces, exercise deletion/expiry, validate offline queues, and review telemetry schemas against the approved data inventory.

## Expected output
A minimized data architecture with explicit purpose, retention, transmission, and deletion controls.

## Stop conditions
Stop when data purpose or legal/policy basis is unclear, or requested diagnostics require collection outside approved privacy boundaries.