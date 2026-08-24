# Data Change Impact Governance

## Purpose
Assess and govern material data changes so downstream consumers, controls, semantics, and compliance remain intact.

## When to use
Use for schema changes, source migrations, semantic changes, pipeline rewrites, deprecations, or ownership transitions.

## Inputs
Proposed change, lineage, contracts, consumers, classifications, criticality, quality controls, release plan.

## Context to inspect
Inspect upstream/downstream dependencies, reports/models, interfaces, retention/access rules, historical compatibility, and rollback capability.

## Core knowledge
Impact is broader than schema compatibility: semantics, timing, quality, lineage, control evidence, and historical comparability can break without structural change.

## Procedure
1. Describe the change and business reason.
2. Classify its materiality and reversibility.
3. Use lineage and usage evidence to identify consumers.
4. Assess structural, semantic, quality, security, retention, and operational impact.
5. Check contract/version requirements.
6. Identify migration, parallel-run, and rollback needs.
7. Notify affected owners/consumers proportionately.
8. Validate in representative environments/data.
9. Update metadata, lineage, definitions, and controls.
10. Monitor after release and close only with evidence.

## Decision points
Use formal approval for high-impact/irreversible changes; automate low-risk compatible changes. Parallel run when historical comparability or critical reporting risk is high.

## Common failure patterns
Schema-only impact analysis, undocumented consumers, silent semantic drift, metadata updated late, no rollback, and assuming successful deployment equals successful change.

## Verification
Confirm identified consumers remain functional, contracts/tests pass, governance metadata is current, and post-change metrics show no unexplained degradation.

## Expected output
Impact assessment, stakeholder plan, migration/rollback strategy, updated governance artifacts, and verification evidence.

## Stop conditions
Escalate unknown critical consumers, irreversible changes without recovery, or unresolved regulatory/reporting impact.