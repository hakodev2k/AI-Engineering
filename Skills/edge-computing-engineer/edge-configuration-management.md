# Edge Configuration Management

## Purpose
Manage desired configuration across edge fleets without creating drift, unsafe changes, or hidden site-specific state.

## When to use
Use when distributing runtime settings, feature flags, endpoint lists, policy, credentials references, or site-specific parameters.

## Inputs
Configuration schema, fleet segments, ownership rules, rollout policy, validation constraints.

## Context to inspect
Inspect current config files, environment variables, remote-management systems, overrides, secrets handling, and restart requirements.

## Core knowledge
Configuration is operational code: it needs schemas, versioning, validation, provenance, staged rollout, rollback, and separation from secrets.

## Procedure
1. Define typed configuration schemas and defaults.
2. Separate immutable build-time values from runtime configuration.
3. Separate secrets from normal configuration.
4. Define precedence for global, fleet, site, and device overrides.
5. Version desired configuration.
6. Validate before distribution and again on-device.
7. Roll out changes progressively.
8. Report observed versus desired state.
9. Detect and remediate drift.
10. Preserve rollback and audit history.

## Decision points
Use centralized desired state for consistency; allow local override only for justified site autonomy with explicit precedence and expiry rules.

## Common failure patterns
Unversioned edits, configuration containing secrets, undocumented override precedence, restart storms, invalid config bricking agents.

## Verification
Test invalid configuration, rollback, disconnected devices, override precedence, and drift detection.

## Expected output
A versioned configuration model with validation, rollout, override, audit, and rollback semantics.

## Stop conditions
Stop when configuration ownership or override precedence cannot be defined unambiguously.