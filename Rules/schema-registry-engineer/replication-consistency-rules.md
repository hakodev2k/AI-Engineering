# Replication and Consistency Rules

## Purpose
Preserve correct schema identity and registry state across replicated instances, regions, or disaster-recovery environments.

## Scope
Metadata replication, schema IDs, subject versions, compatibility configuration, failover, and conflict handling.

## MUST
- Replication design MUST define which registry state is authoritative and how conflicts are prevented or resolved.
- Schema identity semantics MUST remain valid across replicated environments used by the same clients or retained data.
- Compatibility configuration and schema references MUST replicate consistently with schema content.
- Failover procedures MUST validate that required schema versions and policies are present before traffic cutover.
- Replication lag MUST be observable when it can affect registration or lookup correctness.

## MUST NOT
- MUST NOT assume locally assigned identifiers are interchangeable across independent registries without explicit mapping guarantees.
- MUST NOT promote a stale replica that lacks schemas required to decode retained production data.
- MUST NOT run active-active registration paths when conflict behavior is undefined.

## SHOULD
- Prefer architectures that preserve immutable schema identity across failure domains.
- Test regional failover with real version and reference relationships.

## Exceptions
Asymmetric replication requires documented limitations, consumer safeguards, and approval.

## Verification
Inspect replication topology, lag metrics, failover tests, identifier mapping, and policy reconciliation evidence.