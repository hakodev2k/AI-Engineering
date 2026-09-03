# Index Maintenance

## Purpose
Keep indexes healthy as data changes through updates, deletes, compaction, rebuilds, and version upgrades.

## Scope
Applies to tombstones, fragmentation, compaction, index rebuilds, maintenance windows, and health validation.

## MUST
- Maintenance triggers MUST be based on observable conditions such as tombstone ratio, fragmentation, recall degradation, storage growth, or vendor-supported health indicators.
- Rebuild and compaction operations MUST be capacity-planned so serving SLOs remain protected or an approved maintenance impact is declared.
- Rebuilt indexes MUST be validated for record completeness, compatibility, retrieval quality, and serving readiness before traffic cutover.
- Maintenance operations MUST be resumable or recoverable from interruption where feasible.
- Risky production maintenance MUST have rollback or recovery procedures.

## MUST NOT
- MUST NOT delete the only healthy index copy before replacement validation.
- MUST NOT schedule heavy maintenance without considering concurrent ingestion and query load.
- MUST NOT infer index health solely from process health.

## SHOULD
- Maintenance SHOULD be automated when trigger conditions and safety checks are deterministic.
- Rebuild duration SHOULD be tracked against growth forecasts.
- Blue/green index replacement SHOULD be preferred for high-risk changes when supported.

## Exceptions
Exceptions require documented urgency, evidence, blast radius, recovery plan, and human approval for destructive or irreversible production actions.

## Verification
Inspect health metrics, maintenance logs, capacity checks, rebuild validation, cutover tests, and recovery exercises.