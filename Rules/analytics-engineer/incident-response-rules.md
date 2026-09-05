# Analytics Incident Response Rules

## Purpose
Provide disciplined response to incorrect, stale, missing, or misleading analytical outputs.

## Scope
Applies to production analytics incidents involving sources, transformations, warehouse workloads, metrics, semantic models, or published data products.

## MUST
- Responders MUST identify affected datasets, active code or configuration versions, and impacted consumers before declaring scope.
- Mitigation MUST prioritize preventing further propagation of incorrect trusted data.
- Incident conclusions MUST be supported by run history, lineage, query evidence, quality checks, or equivalent operational data.
- Significant incidents MUST record timeline, impact, mitigation, causal evidence, and corrective actions.
- Corrected data MUST be reconciled after repair or backfill before the incident is closed.

## MUST NOT
- MUST NOT silently overwrite incorrect historical outputs without preserving investigation evidence.
- MUST NOT claim root cause based only on temporal correlation.
- MUST NOT continue publishing known materially incorrect metrics merely to preserve schedule continuity.

## SHOULD
- Notify affected downstream owners when trusted outputs are materially wrong or delayed.
- Convert confirmed failure modes into tests, monitors, or release gates.

## Exceptions
Emergency actions may precede normal review when authorized by incident policy but MUST be documented afterward.

## Verification
Review incident records, lineage, run logs, corrected outputs, reconciliations, and follow-up tests.