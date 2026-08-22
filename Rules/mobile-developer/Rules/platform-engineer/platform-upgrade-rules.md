# Platform Upgrade Rules

## Purpose
Control upgrades of shared platform components without breaking consuming workloads.

## Scope
Applies to runtimes, clusters, operators, SDKs, templates, base images, managed services, and platform dependencies.

## MUST
- Upgrades MUST identify compatibility risks, deprecated behavior, and affected consumers.
- High-impact upgrades MUST be validated in representative non-production environments before production rollout.
- Consumers MUST receive migration guidance when behavior or requirements change.
- Rollback or safe forward-fix strategy MUST exist before production execution.

## MUST NOT
- MUST NOT force major-version migrations without impact analysis and communication.
- MUST NOT remove supported interfaces before the announced compatibility window ends.
- MUST NOT combine unrelated high-risk upgrades when separation materially improves rollback.

## SHOULD
- Prefer incremental upgrades and automated compatibility checks.
- Track unsupported versions and owners.

## Exceptions
Emergency security upgrades may shorten normal timelines with explicit approval, risk evidence, and intensified verification.

## Verification
Use compatibility tests, dependency inventories, staging results, deprecation scans, rollout telemetry, and post-upgrade validation.