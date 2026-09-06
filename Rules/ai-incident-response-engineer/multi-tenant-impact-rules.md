# Multi-Tenant Impact Rules

## Purpose
Prevent and investigate cross-tenant impact in shared AI systems.

## Scope
Applies to tenant isolation, shared retrieval, caches, memory, model context, tools, quotas, logs, and shared infrastructure.

## MUST
- Suspected cross-tenant incidents MUST immediately assess whether data, context, actions, or permissions crossed tenant boundaries.
- Investigation MUST identify the isolation boundary that should have prevented the event and test that boundary directly.
- Shared caches, retrieval indexes, conversational memory, tool state, and correlation identifiers MUST be considered where relevant.
- Containment MUST prevent further cross-tenant exposure before broad service restoration.
- Evidence access MUST itself preserve tenant confidentiality and least privilege.
- Remediation MUST include regression tests demonstrating tenant isolation under representative concurrent conditions.

## MUST NOT
- Tenant identifiers supplied only by untrusted client input MUST NOT be assumed authoritative during investigation.
- Cross-tenant exposure MUST NOT be treated as a normal correctness defect without security/privacy escalation.
- Responders MUST NOT use another tenant's production data for reproduction without explicit authorization and controls.

## SHOULD
- Maintain automated isolation tests for shared AI components.
- Use tenant-aware telemetry that avoids exposing tenant data unnecessarily.

## Exceptions
Architectures without tenants should document non-applicability; any equivalent security-domain boundary must still be protected.

## Verification
Inspect authorization enforcement, cache/index keys, memory scoping, tool credentials, concurrency tests, and tenant-aware audit logs.