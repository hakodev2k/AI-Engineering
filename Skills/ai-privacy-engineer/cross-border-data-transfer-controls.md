# Cross-Border Data Transfer Controls

## Purpose
Engineer AI data paths so geographic processing and storage behavior matches approved regional and transfer requirements across cloud services, model providers, analytics, support tooling, and subprocessors.

## When to use
Use when launching in new regions, adopting global model APIs, changing cloud architecture, adding vendors, or moving datasets between environments.

## Inputs
- Deployment regions and user populations
- Data-flow map
- Vendor and subprocessor locations
- Regional requirements supplied by privacy/legal stakeholders
- Cloud and model-provider configuration

## Context to inspect
Inspect API endpoints, storage regions, backup replication, telemetry destinations, support access, CDN routing, failover regions, model-provider processing locations, and data export jobs.

## Core knowledge
Region labels in product settings do not always guarantee that every subservice, log, support workflow, failover path, or subprocessor remains in-region. Engineering controls should enforce routing and storage behavior where technically possible and provide evidence for exceptions.

## Procedure
1. Map each personal-data flow to source and destination regions.
2. Identify all processors and subprocessors involved in the path.
3. Verify region-pinning capabilities for storage and inference endpoints.
4. Check backup, disaster recovery, telemetry, and support paths separately.
5. Configure region-specific endpoints, accounts, keys, or projects where needed.
6. Add routing guards that prevent unsupported regional transfers.
7. Minimize data sent to globally operated services.
8. Document approved exceptions and transfer mechanisms supplied by responsible stakeholders.
9. Test failover behavior to ensure it does not silently cross prohibited boundaries.
10. Monitor configuration drift and provider-region changes.
11. Reassess when vendors add subprocessors or regions.

## Decision points
Prefer regional isolation when requirements are strict and operational complexity is manageable. Use global services only when transfer requirements are satisfied and residual exposure is accepted. Avoid assuming IP geolocation alone is sufficient for residency enforcement.

## Common failure patterns
- Pinning databases but not logs or backups
- Ignoring model-provider inference region
- Global failover crossing restricted boundaries
- Support tooling copying payloads to another region
- Region settings differing between environments

## Verification
Trace controlled requests through DNS, endpoints, provider dashboards, storage metadata, logs, and failover tests. Confirm that each transfer matches the approved architecture.

## Expected output
A region-aware AI architecture with mapped transfers, enforcement controls, validated failover behavior, provider evidence, and documented exceptions.

## Stop conditions
Escalate when a required service cannot meet approved transfer constraints, provider processing locations are unclear, or failover requirements conflict with regional restrictions.