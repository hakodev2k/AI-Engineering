# GPU Multi-Tenancy and Isolation Rules

## Purpose
Protect tenants, workloads, and shared accelerator capacity from cross-tenant leakage, interference, and unsafe privilege sharing.

## Scope
Applies to shared hosts, GPU partitioning, device assignment, namespaces, quotas, caches, local storage, and administrative access.

## MUST
- Tenant boundaries MUST be defined for compute, memory, storage, network, credentials, logs, and administrative operations.
- GPU sharing or partitioning modes MUST be explicitly supported for the hardware, runtime, and threat model.
- Residual workload data in local scratch, caches, and reusable resources MUST be handled according to data-sensitivity requirements before reassignment.
- Administrative access to GPU nodes MUST follow least privilege and be auditable.
- Noisy-neighbor risk MUST be measured where shared execution can affect latency or throughput commitments.

## MUST NOT
- Tenants MUST NOT receive broader device or host access merely because standard GPU integration is inconvenient.
- Isolation claims MUST NOT rely solely on scheduler labels when enforcement requires runtime or infrastructure controls.
- Sensitive tenant identifiers or payloads MUST NOT be exposed in shared diagnostics without authorization.

## SHOULD
- Dedicated pools SHOULD be used when hardware sharing cannot satisfy required isolation or performance predictability.
- Isolation controls SHOULD be tested after runtime, firmware, or partitioning changes.

## Exceptions
Exceptions require explicit risk acceptance, compensating controls, bounded duration, and accountable approval.

## Verification
Review IAM, device assignment, partition configuration, runtime permissions, cross-tenant tests, audit records, and interference benchmarks.