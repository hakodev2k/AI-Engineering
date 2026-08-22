# Data Engineer Rules

Operating constraints for AI-assisted work performed in the Data Engineer discipline. These files are policy guidance, require no installation, and should be combined with repository-specific instructions and deterministic checks.

Each rule file is self-contained and may be copied independently; this README and the sibling rules are navigation and optional context, not runtime dependencies.

## Usage

1. Select the smallest set of rules that covers the planned change.
2. Resolve conflicts using repository policy, explicit approval boundaries, and the stricter safety requirement.
3. Where available, optionally pair the rules with relevant engineering procedures.
4. Convert critical requirements into tests, hooks, or CI checks in the target repository.

## Catalogue

- [Backfill and Reprocessing Rules](backfill-reprocessing-rules.md)
- [Cost and Capacity Rules](cost-capacity-rules.md)
- [Data Contract Rules](data-contract-rules.md)
- [Data Lineage Rules](data-lineage-rules.md)
- [Data Quality Rules](data-quality-rules.md)
- [Data Security Rules](data-security-rules.md)
- [Incident and Recovery Rules](incident-recovery-rules.md)
- [Incremental Processing Rules](incremental-processing-rules.md)
- [Observability Rules](observability-rules.md)
- [Partitioning and Storage Rules](partitioning-storage-rules.md)
- [Pipeline Orchestration Rules](pipeline-orchestration-rules.md)
- [Privacy and Governance Rules](privacy-governance-rules.md)
- [Production Safety Rules](production-safety-rules.md)
- [Query Performance Rules](query-performance-rules.md)
- [Schema Evolution Rules](schema-evolution-rules.md)
- [Source Ingestion Rules](source-ingestion-rules.md)
- [Stream Processing Rules](stream-processing-rules.md)
- [Testing Rules](testing-rules.md)
- [Transformation Rules](transformation-rules.md)
- [Warehouse Modeling Rules](warehouse-modeling-rules.md)

## Maintenance

When adding a rule, keep it focused, link it from this index, preserve the surrounding terminology, and document verification and approval boundaries. Follow the host repository's contribution policy when one exists.
