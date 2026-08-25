# HSM and Secure Key Custody

## Purpose
Use HSMs, secure elements, or managed cryptographic modules to reduce exposure of high-value keys and enforce custody policy.

## When to use
Use for CA roots/intermediates, code signing, payment/security-critical keys, regulated workloads, or keys whose extraction would have high blast radius.

## Inputs
Key impact, throughput/latency, availability targets, module capabilities, compliance level, operator model, and disaster-recovery requirements.

## Context to inspect
Module partitions, roles, authentication, quorum/dual control, backup, clustering, firmware, audit, export policy, API/PKCS interfaces, and failover.

## Core knowledge
An HSM changes the trust boundary but does not automatically secure applications. Authorization, operator access, key attributes, backup, firmware, availability, and client authentication remain critical.

## Procedure
1. Classify keys by compromise impact.
2. Define which operations must remain inside the module.
3. Select appropriate module assurance and deployment model.
4. Configure roles, least privilege, dual control, and audit.
5. Generate keys inside the protected boundary where possible.
6. Mark keys non-exportable unless controlled backup requires wrapping.
7. Authenticate applications strongly to the module.
8. Design capacity, redundancy, failover, and maintenance.
9. Establish backup/recovery and compromise ceremonies.
10. Test failover, access denial, audit, restore, and key-destruction workflows.

## Decision points
Managed HSMs reduce operational burden; dedicated appliances may offer stronger control or specialized certification. Non-exportability improves containment but raises disaster-recovery dependency.

## Common failure patterns
Shared admin credentials; broad application permissions; exporting keys for convenience; no capacity planning; untested backup; HSM as single point of failure; weak client authentication.

## Verification
Inspect key attributes and role policy, exercise quorum controls, failover and recovery, and confirm audit events for privileged operations.

## Expected output
A custody architecture with key classification, roles, module controls, HA, backup, ceremonies, and evidence.

## Stop conditions
Stop if required recovery conflicts with non-exportability, module capacity cannot meet SLOs, or custody roles cannot be separated as required.