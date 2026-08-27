# Cloud Forensics Rules

## Purpose
Preserve and interpret cloud evidence while accounting for provider abstractions, ephemeral resources, and control-plane behavior.

## Scope
Covers cloud audit logs, object storage, compute, containers, serverless workloads, IAM, snapshots, and managed services.

## MUST
- Collection MUST identify tenant/account/project, region, resource identifiers, API used, query scope, and collection time.
- Provider-side retention and export limitations MUST be assessed before relying on absence of evidence.
- Cloud snapshots and exports MUST preserve provider metadata required for interpretation.
- Identity findings MUST distinguish human, workload, service, delegated, and assumed identities.
- Collection actions that can alter resources, retention, access, or billing materially MUST be authorized.
- Cross-account evidence MUST maintain separate provenance.

## MUST NOT
- MUST NOT assume a display name uniquely identifies a cloud resource.
- MUST NOT delete, stop, snapshot, isolate, or change production resources without authority.
- MUST NOT expose cloud credentials in evidence packages.

## SHOULD
- Collect control-plane and data-plane evidence together when relevant.
- Record provider request IDs for reproducibility.

## Exceptions
Provider constraints may require logical exports; document unavailable evidence classes and compensating sources.

## Verification
Validate resource IDs, export queries, audit coverage, IAM context, snapshot metadata, hashes of downloaded artifacts, and provider-side timestamps.