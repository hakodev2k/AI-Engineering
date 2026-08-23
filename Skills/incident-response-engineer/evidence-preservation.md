# Evidence Preservation

## Purpose
Preserve reliable operational evidence so incident decisions, root-cause analysis, audits, and security investigations remain defensible.

## When to use
Use for severe, ambiguous, security-relevant, data-integrity, or recurring incidents where transient evidence may disappear.

## Inputs
Logs, traces, metrics, audit records, configuration, deployment metadata, snapshots, request samples, and retention policies.

## Context to inspect
Inspect data retention, sampling, access controls, clock synchronization, sensitive fields, ephemeral infrastructure, and log rotation.

## Core knowledge
Evidence must retain provenance and context. Collection should minimize alteration of the system and comply with privacy and security restrictions.

## Procedure
1. Identify evidence likely to expire or change.
2. Record authoritative timestamps and incident identifiers.
3. Preserve relevant queries, event IDs, trace IDs, configuration versions, and deployment SHAs.
4. Export or snapshot ephemeral evidence using approved mechanisms.
5. Record who collected evidence, when, and from which source.
6. Protect sensitive evidence with appropriate access controls.
7. Avoid modifying original artifacts when a copy is sufficient.
8. Validate preserved artifacts can be read and correlated later.
9. Document gaps caused by sampling or retention.

## Decision points
Preserve broad evidence when scope is uncertain but balance collection against privacy, cost, and operational load. Prefer immutable or versioned storage where available.

## Common failure patterns
Copying screenshots without query context, losing time zones, collecting secrets unnecessarily, overwriting originals, and waiting until retention expires.

## Verification
Confirm preserved evidence includes provenance, timestamps, identifiers, access protection, and enough context to reproduce key observations.

## Expected output
An evidence inventory with locations, provenance, retention, sensitivity, and known gaps.

## Stop conditions
Escalate when preservation requires access beyond authorization, legal hold decisions, or handling highly sensitive data outside approved systems.