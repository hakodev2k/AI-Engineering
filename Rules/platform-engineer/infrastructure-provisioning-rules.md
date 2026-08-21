# Infrastructure Provisioning Rules

## Purpose
Make infrastructure creation reproducible, reviewable, and recoverable.

## Scope
Applies to infrastructure-as-code modules, provisioning services, cloud resources, clusters, networks, storage, and databases created through the platform.

## MUST
- Provisioned infrastructure MUST be represented by declarative or otherwise reproducible definitions.
- Resource ownership, environment, and lifecycle metadata MUST be recorded.
- Destructive changes MUST be detectable before execution.
- Provisioning MUST be retry-safe or explicitly document non-idempotent behavior.

## MUST NOT
- MUST NOT make untracked manual production changes as the normal operating model.
- MUST NOT destroy stateful resources without approved recovery or migration planning.
- MUST NOT apply broad permissions merely to simplify provisioning.

## SHOULD
- Prefer reusable modules with constrained inputs and safe defaults.
- Detect drift where unmanaged changes can invalidate guarantees.

## Exceptions
Emergency manual changes require audit evidence, approval, and reconciliation back into managed state.

## Verification
Use plan/diff review, IaC validation, policy checks, integration tests, drift detection, and resource inventory inspection.