# Intelligence Automation and Enrichment

## Purpose
Automate repetitive intelligence processing while preserving provenance, reviewability, cost control, and safe failure behavior.

## When to use
Use for normalization, enrichment, deduplication, scoring, routing, expiry, or recurring collection tasks.

## Inputs
Workflow requirements, APIs, schemas, rate limits, credentials mechanism, data classifications, failure modes, human review points.

## Context to inspect
Inspect current manual workflow, volumes, deterministic steps, ambiguous decisions, downstream dependencies, secrets handling, and API quotas.

## Core knowledge
Automate deterministic transformations first. External enrichment can be stale or wrong and should not silently overwrite primary evidence.

## Procedure
1. Map workflow inputs, decisions, outputs, and owners.
2. Separate deterministic steps from analytic judgments.
3. Define schemas and idempotency keys.
4. Implement bounded retries, timeouts, rate limits, and backoff.
5. Preserve raw values and enrichment provenance.
6. Route ambiguous/high-impact cases to human review.
7. Protect secrets and sensitive data.
8. Add metrics, logs, dead-letter handling, and replay.
9. Test malformed, duplicate, stale, and unavailable-source cases.
10. Measure analyst time saved and error rate.

## Decision points
Automate when volume and repeatability justify maintenance; keep attribution, ambiguous merging, and consequential judgments human-supervised.

## Common failure patterns
Infinite retries, hidden source failures, destructive enrichment, duplicated records, leaked API keys, and automation without monitoring.

## Verification
Replays are idempotent, provenance survives transformations, failures are visible, and sampled outputs match analyst expectations.

## Expected output
Documented, observable enrichment workflow with safe error handling and review boundaries.

## Stop conditions
Stop automation when source terms prohibit use, sensitive data would leave approved boundaries, or failure cannot be made observable/recoverable.