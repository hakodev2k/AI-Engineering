# Multi-Tenant Isolation Rules

## Purpose
Prevent one tenant, organization, workspace, or user boundary from influencing or exposing another tenant's AI data, capabilities, or resources.

## Scope
Applies to prompts, histories, caches, embeddings, vector stores, files, model adapters, tool credentials, telemetry, and shared inference infrastructure.

## MUST
- Tenant identity MUST be derived from authenticated server-side context and propagated through every data and authorization boundary.
- Data stores, retrieval queries, caches, and tool calls MUST enforce tenant isolation deterministically.
- Shared model context MUST NOT contain protected content from unrelated tenants.
- Cross-tenant access tests MUST cover reads, writes, retrieval, deletion, caches, exports, and administrative paths.
- Shared infrastructure MUST have resource controls that prevent one tenant from causing unacceptable denial of service to others.

## MUST NOT
- MUST NOT trust tenant identifiers supplied only by client input.
- MUST NOT use globally shared caches for tenant-sensitive outputs without isolation-aware keys and access controls.
- MUST NOT depend on model instructions to maintain tenant boundaries.

## SHOULD
- Prefer explicit tenant-scoped storage abstractions and policy enforcement.
- Monitor anomalous cross-tenant identifiers and authorization failures.

## Exceptions
Exceptions require a documented shared-data model, explicit authorization semantics, threat analysis, tests, and security approval.

## Verification
Run cross-tenant negative tests, inspect cache keys and namespaces, review IAM and database policies, trace tenant context across services, and verify deletion and export paths.