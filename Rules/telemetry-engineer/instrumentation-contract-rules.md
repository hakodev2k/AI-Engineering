# Instrumentation Contract Rules

## Purpose
Define stable, reviewable contracts for emitted telemetry so producers and consumers can evolve safely.

## Scope
Applies to logs, metrics, traces, events, attributes, dimensions, and SDK instrumentation.

## MUST
- Every production telemetry signal MUST have a defined owner, semantic purpose, field contract, and expected consumers.
- Required fields and identifiers MUST be documented and validated before rollout.
- Contract changes that can break dashboards, alerts, joins, or downstream processing MUST use a compatibility or migration plan.
- Producers MUST emit only fields whose meaning is stable enough for intended use.

## MUST NOT
- MUST NOT silently repurpose an existing field with a different meaning.
- MUST NOT add unbounded free-form fields to structured telemetry without review.
- MUST NOT make consumer-critical schema changes without impact analysis.

## SHOULD
- Prefer shared semantic conventions over service-specific naming when they fit.

## Exceptions
Exceptions require rationale, affected consumers, migration or containment plan, risk, and approval when impact is material.

## Verification
Review schemas, instrumentation code, contract tests, downstream queries, dashboards, and change records.