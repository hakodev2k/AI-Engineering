# AI Telemetry Normalization

## Purpose
Normalize heterogeneous AI security telemetry into a consistent event model that supports correlation, detection, investigation, and retention controls across applications, models, agents, tools, and infrastructure.

## When to use
Use when multiple AI services or providers emit incompatible logs, when SIEM detections are brittle, or when investigations require manual reconstruction across systems.

## Inputs
Raw logs, traces, audit events, provider schemas, identity records, tool events, retrieval metadata, network telemetry, and retention requirements.

## Preconditions
Representative event samples and source ownership are available.

## Context to inspect
Inspect timestamp formats, identifiers, tenant fields, session/request IDs, model metadata, tool-call fields, authorization outcomes, sensitivity labels, and existing security schemas.

## Core knowledge
Useful normalization preserves provenance while creating stable semantic fields. Important dimensions include principal, tenant, request/session, model, prompt class, retrieval source, tool, action, target, result, policy outcome, environment, and correlation identifiers.

## Procedure
1. Inventory telemetry sources and security use cases.
2. Define a minimal canonical event schema.
3. Map source-specific fields without discarding raw provenance.
4. Normalize timestamps, identities, tenant IDs, model/version names, action types, and outcomes.
5. Add correlation identifiers across inference, retrieval, and tool execution.
6. Mark missing or low-confidence fields explicitly.
7. Apply redaction and minimization before central storage.
8. Validate schema changes against existing detections.
9. Version mappings and document ownership.

## Decision points
Preserve source-native events when normalization would lose forensic detail. Create derived fields only when their semantics are stable and testable.

## Common failure patterns
Overwriting raw evidence, conflating user and service identities, dropping model/version information, inconsistent clocks, and creating fields whose meaning varies by provider.

## Verification
Implemented means source events map into the canonical schema. Verified means representative investigations can correlate end-to-end activity without ambiguity and existing detections still operate correctly.

## Expected output
Canonical schema, source mappings, redaction rules, validation tests, and documented gaps.

## Stop conditions
Escalate when identifiers cannot be reconciled, source clocks are unreliable, or required normalization would violate retention or privacy constraints.