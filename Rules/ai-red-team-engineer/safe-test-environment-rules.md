# Safe Test Environments

## Purpose
Contain adversarial testing and minimize unintended impact.

## Scope
Sandboxes, staging, production-like environments, test accounts, networks, data stores, and external integrations.

## MUST
- Prefer isolated environments that preserve the security property being tested.
- Bound resource consumption, external communications, permissions, and data access before executing adversarial workloads.
- Define stop conditions and recovery procedures for tests with meaningful operational risk.

## MUST NOT
- Connect destructive test tooling to production by default.
- Assume a staging label guarantees isolation.

## SHOULD
Use synthetic data, mock external actions, quotas, egress restrictions, and disposable identities.

## Exceptions
Production testing requires explicit approval, monitoring, limited blast radius, and rollback readiness.

## Verification
Inspect environment configuration, network paths, credentials, quotas, data sources, stop controls, and recovery evidence.