# Serving Security and Isolation

## Purpose
Secure inference infrastructure and isolate tenants, models, credentials, and data without undermining performance objectives.

## When to use
Use when serving sensitive workloads, multi-tenant traffic, proprietary models, or externally accessible inference APIs.

## Inputs
Threat model, data classification, authentication design, tenancy model, network topology, runtime permissions, secrets, and compliance requirements.

## Context to inspect
Inspect ingress authentication, authorization, tenant routing, model artifact access, container/device privileges, network egress, logging, temporary storage, caches, admin endpoints, and dependency provenance.

## Core knowledge
Inference optimizations can weaken isolation through shared caches, broad device access, unsafe custom kernels, debug endpoints, or cross-tenant batching. Security boundaries should be explicit and tested under the actual serving topology.

## Procedure
1. Identify protected assets and trust boundaries.
2. Map tenant and operator privileges.
3. Authenticate callers and authorize model/action access explicitly.
4. Minimize runtime, filesystem, device, and network permissions.
5. Store credentials outside model artifacts and source code.
6. Validate artifact provenance and integrity before loading.
7. Prevent sensitive request content from entering logs or metrics by default.
8. Review shared batching and caches for cross-tenant leakage.
9. Restrict administrative and profiling endpoints.
10. Patch runtimes, drivers, and serving dependencies under controlled rollout.
11. Test isolation and unauthorized-access paths.
12. Document incident containment and credential-rotation procedures.

## Decision points
Use dedicated pools when regulatory or threat requirements outweigh utilization gains from sharing. Allow shared batching/cache only when the runtime provides adequate isolation and data handling is explicitly approved.

## Common failure patterns
Shared cache keys without tenant scope, privileged containers by default, public debug endpoints, secrets in environment dumps, unrestricted model downloads, and verbose prompt logging.

## Verification
Verified means access-control tests, isolation tests, artifact checks, and runtime configuration review demonstrate the intended boundaries without relying solely on documentation.

## Expected output
Threat-boundary map, hardened serving configuration, isolation evidence, and security operating procedures.

## Stop conditions
Escalate on suspected data leakage, untrusted model artifacts, unresolved cross-tenant isolation risk, or required privileges that exceed approved policy.