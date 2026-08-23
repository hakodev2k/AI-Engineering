# Live Configuration and Balance Safety

## Purpose
Operate tunable gameplay configuration safely across releases without allowing remote values to violate invariants, break compatibility, or create unrecoverable player state.

## When to use
Use for live balance, feature flags, events, economy tuning, difficulty parameters, server-driven configuration, or emergency kill switches.

## Inputs
Tunable parameters, configuration service, defaults, validation rules, rollout needs, telemetry, offline behavior, and approval process.

## Context to inspect
Inspect config loading, caching, schema/versioning, fallback defaults, client/server authority, experiment assignment, audit history, and values used in persistence/economy calculations.

## Core knowledge
Remote configuration is untrusted operational input even when controlled internally. Values need type/range/cross-field validation, safe defaults, version compatibility, auditability, and rollback. Not every mechanic is safe to tune live.

## Procedure
1. Classify parameters by operational risk.
2. Define typed schemas, ranges, and cross-field invariants.
3. Embed known-good defaults in the build/server.
4. Validate downloaded configuration before activation.
5. Version schemas and define compatibility behavior.
6. Apply high-risk changes through staged rollout.
7. Keep audit history and rapid rollback.
8. Define offline/cache-expiry behavior.
9. Monitor gameplay and technical guardrails after changes.
10. Test malformed, stale, partial, and incompatible configuration.

## Decision points
Use live configuration for reversible tuning and feature exposure; require code/content release for structural changes or parameters that affect persistent schema semantics. Server-authoritative values are required for exploitable economy outcomes.

## Common failure patterns
No defaults, accepting arbitrary values, changing persistent formulas mid-transaction, client-authoritative economy config, no audit trail, and rollout to 100% without guardrails.

## Verification
Test invalid/stale configs, rollback, offline startup, version mismatch, staged rollout, and telemetry thresholds.

## Expected output
A validated, versioned, reversible configuration system with explicit risk controls.

## Stop conditions
Stop when a proposed live change can irreversibly corrupt progression/economy state or lacks an authorized rollback/approval path.