# Collector Pipeline Rules

## Purpose
Operate trace collection pipelines as reliable production infrastructure with controlled transformation and failure behavior.

## Scope
Applies to agents, gateways, collectors, processors, exporters, queues, routing, and multi-backend delivery.

## MUST
- Collector topology MUST document failure domains, buffering, routing, authentication, and capacity assumptions.
- Pipelines MUST expose accepted, dropped, refused, queued, retried, and exported telemetry where supported.
- Transform and filter processors MUST be deterministic, version-controlled, and tested against representative spans.
- Collector saturation MUST degrade according to an explicit policy rather than silently consuming unbounded resources.

## MUST NOT
- MUST NOT make production applications depend synchronously on collector availability unless explicitly required and approved.
- MUST NOT deploy filtering that can remove required incident or compliance evidence without review.
- MUST NOT route sensitive traces to an unapproved destination.

## SHOULD
- Isolate critical telemetry paths from experimental exporters.
- Capacity plans SHOULD account for bursts, retries, backend outages, and replay where supported.

## Exceptions
Exceptions require architecture rationale, blast-radius analysis, rollback procedure, and owner approval.

## Verification
Inspect collector configuration, run failure and saturation tests, validate processor fixtures, monitor drop/retry metrics, and verify destination access controls.
