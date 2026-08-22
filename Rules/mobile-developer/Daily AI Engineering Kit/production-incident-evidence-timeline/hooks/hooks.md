# Hooks

## PreTask
**Trigger:** incident workflow starts.

**Action:** verify evidence files are readable and original exports are preserved.

**Command:** project-specific read-only checks plus normalization input validation.

**Failure behavior:** stop if evidence cannot be read or preservation status is uncertain.

## PostEvidenceCollection
**Trigger:** raw evidence export completes.

**Action:** normalize and sort events.

```bash
python scripts/normalize-events.py --input raw-events.json --output incident-timeline.json
```

**Failure behavior:** stop on invalid records. Do not invent timestamps or silently drop events.

## PostAnalysis
**Trigger:** investigator creates or revises `incident-report.json`.

**Action:** run structural verification.

```bash
python scripts/verify-incident-report.py --report incident-report.json --structure-only
```

**Failure behavior:** return to Investigator for correction; semantic review has not started yet.

## PreMitigation
**Trigger:** a production mutation is proposed.

**Action:** verify report contains mitigation action, expected effect, rollback path, blast-radius statement, and approval status.

**Failure behavior:** block execution if approval is required and not recorded.

## PostMitigation
**Trigger:** approved mitigation completes.

**Action:** append the action/result as evidence and run project-specific health checks.

**Failure behavior:** if impact worsens or health checks fail, stop automatic actions, preserve evidence, and return to human incident owner.

## PreComplete
**Trigger:** workflow is about to declare `verified`.

**Action:** run full report validation and required project recovery checks.

```bash
python scripts/verify-incident-report.py --report incident-report.json
```

**Failure behavior:** status may remain `investigating` or `mitigated`, but must not become `verified`.

## Hook design note
Use deterministic hooks for validation, normalization, and health checks. Use AI agents only for semantic correlation, hypothesis formation, and evidence review. Repository adopters should add their real health-check commands rather than inventing generic production commands.
