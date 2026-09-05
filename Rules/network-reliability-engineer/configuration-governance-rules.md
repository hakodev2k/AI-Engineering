# Configuration Governance Rules

## Purpose
Keep network configuration controlled, reviewable, reproducible, and recoverable.

## Scope
Device and service configuration, templates, policy definitions, environment-specific values, and configuration sources of truth.

## MUST
- Production configuration MUST be versioned or otherwise auditable.
- Configuration generation MUST validate syntax and required invariants before application.
- Running state MUST be comparable with the intended source of truth.
- Drift affecting reliability or security MUST be investigated and reconciled.
- Critical defaults and inherited settings MUST be understood before changes are approved.

## MUST NOT
- MUST NOT use undocumented manual edits as the normal production change mechanism.
- MUST NOT store credentials in ordinary configuration repositories.
- MUST NOT overwrite known-good configuration without preserving recovery capability.

## SHOULD
- Prefer declarative configuration and deterministic rendering.
- Use automated diff review and policy validation.

## Exceptions
Emergency manual changes require authorization, capture of final state, and reconciliation afterward.

## Verification
Inspect configuration history, rendered diffs, drift reports, validation output, and source-of-truth records.