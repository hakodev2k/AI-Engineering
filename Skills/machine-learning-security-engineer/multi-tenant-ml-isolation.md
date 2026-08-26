# Multi-Tenant ML Isolation

## Purpose
Prevent one tenant, project, or workload from accessing another tenant's data, model artifacts, compute context, credentials, or inference state.

## When to use
Use for shared ML platforms, hosted inference, shared GPU clusters, feature stores, notebook services, or SaaS model products.

## Inputs
Tenant model, identity architecture, storage layout, compute scheduler, caches, model-serving topology, network policy, and data classification.

## Preconditions
Define tenant boundaries and acceptable sharing explicitly.

## Context to inspect
Inspect object stores, databases, feature stores, vector stores, caches, batchers, model servers, GPU scheduling, temporary files, logs, metrics, and support/admin paths.

## Core knowledge
Isolation failures often occur in metadata and caches rather than core model code. Shared batching and accelerators improve efficiency but increase cross-tenant state and side-channel concerns. Authorization must be enforced server-side at every resource boundary.

## Procedure
1. Enumerate tenant-scoped resources and identifiers.
2. Trace tenant identity from ingress through every downstream call.
3. Enforce authorization at storage, registry, feature, and serving layers.
4. Partition or key caches with tenant identity.
5. Prevent cross-tenant batch/result mix-ups.
6. Isolate temporary files and artifact staging.
7. Restrict east-west network access between tenant workloads.
8. Evaluate accelerator/process isolation appropriate to sensitivity.
9. Ensure logs and metrics do not expose another tenant's payload or identifiers unnecessarily.
10. Test administrative/support impersonation controls.
11. Add negative tests for identifier substitution and race conditions.
12. Monitor cross-tenant authorization failures.

## Decision points
Use dedicated compute for high-sensitivity tenants when logical isolation cannot meet requirements. Shared serving is appropriate when authorization, state partitioning, and side-channel risk are acceptable. Prefer explicit tenant context over inference from user-supplied resource IDs.

## Common failure patterns
Tenant ID accepted from request without binding to identity; shared unkeyed cache; batch response index mix-up; common writable model directory; broad support access; metrics labels leaking customer identifiers.

## Verification
Run cross-tenant access tests at every resource type, concurrent batching tests, cache-isolation tests, and privilege reviews. Confirm failures are logged without leaking protected content.

## Expected output
A documented isolation model, enforced boundaries, negative regression tests, and residual shared-infrastructure risks.

## Stop conditions
Stop when tenant identity cannot be propagated reliably, shared infrastructure violates contractual isolation, or testing risks exposure of real tenant data.