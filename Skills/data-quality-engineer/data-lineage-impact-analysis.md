# Data Lineage Impact Analysis

## Purpose
Use lineage and dependency evidence to determine where a data defect or proposed change can propagate and which consumers require protection.

## When to use
Use before schema changes, remediation, deprecation, incident response, or quality-control placement.

## Inputs
Technical lineage, business lineage, query/code dependencies, orchestration metadata, ownership, and change/incident scope.

## Preconditions
Treat lineage metadata as evidence with confidence levels, not guaranteed completeness.

## Context to inspect
Inspect source-to-target transformations, views, jobs, BI models, APIs, ML features, exports, schedules, and undocumented dependencies discoverable from query logs or code search.

## Core knowledge
Lineage has column, dataset, job, and business-process levels. Runtime lineage can reveal dependencies absent from static catalogs; static lineage can reveal dormant but important paths.

## Procedure
1. Identify affected fields, datasets, and time range.
2. Trace upstream sources to understand origin.
3. Trace downstream consumers and transformations.
4. Validate critical paths using runtime/query evidence.
5. Classify consumers by business criticality.
6. Identify transformations that amplify or mask defects.
7. Determine earliest reliable control point.
8. Notify owners of material dependencies.
9. Define validation for each critical downstream path.
10. Update lineage metadata when gaps are discovered.

## Decision points
Use column-level lineage when field semantics change; dataset-level may suffice for operational outages. Prioritize observed runtime consumers but do not ignore critical scheduled/dormant dependencies.

## Common failure patterns
Assuming catalog lineage is complete; stopping at immediate consumers; missing extracts and manual exports; confusing ownership with usage; failing to capture newly discovered dependencies.

## Verification
Cross-check lineage against orchestration, code, and query logs; confirm critical owners recognize dependencies; validate downstream outputs after change/remediation.

## Expected output
An impact map with affected paths, critical consumers, confidence gaps, validation plan, and updated lineage evidence.

## Stop conditions
Stop destructive changes when critical lineage remains materially uncertain or affected consumer ownership cannot be resolved.