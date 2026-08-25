# Incident Investigation Rules

## Purpose
Diagnose streaming incidents using evidence while minimizing additional data loss or duplicate effects.

## Scope
Applies to lag, loss, duplicates, corruption, ordering anomalies, schema failures, and processing outages.

## MUST
- Investigation MUST establish an incident timeline using available broker, producer, consumer, infrastructure, and downstream evidence.
- Operators MUST distinguish ingestion failure, broker retention/durability, consumer lag, processing failure, and sink failure before corrective action.
- Destructive actions such as offset reset, state deletion, topic deletion, or mass replay MUST require explicit approval.
- Evidence required for root cause MUST be preserved before ephemeral logs or metrics expire when practical.
- Corrective claims MUST be validated against observed symptoms and post-change telemetry.

## MUST NOT
- MUST NOT reset offsets merely to make lag disappear.
- MUST NOT delete poison events or state before preserving evidence needed for diagnosis.
- MUST NOT infer event loss solely from a consumer's missing output without tracing upstream and downstream stages.
- MUST NOT expose sensitive payloads in incident channels unnecessarily.

## SHOULD
- Hypotheses SHOULD be ranked and tested with minimally invasive evidence.
- Incident findings SHOULD identify contributing conditions, detection gaps, and prevention actions rather than only the triggering fault.

## Exceptions
Emergency containment may precede full diagnosis when impact is ongoing, but actions must be reversible where possible, approved, and recorded.

## Verification
Review incident timeline, telemetry queries, audit logs, offset/partition evidence, reproduction tests, and post-incident action validation.