# Optimistic concurrency investigation report

## Scope
Describe the aggregate/entity and write paths investigated.

## Facts
List repository/runtime facts with file, test, log, or database evidence.

## Writer map
For each writer record entry point, read version source, transaction boundary, write operation, conflict behavior, and retry behavior.

## Two-writer timeline
Record initial version, writer A read/write, writer B read/write, observed outcomes, and final state.

## Hypotheses
Keep unverified explanations separate from facts.

## Decision
Use one: `safe`, `lost-update-confirmed`, `inconclusive`, `approval-required`.

## Proposed change
State the smallest safe correction and affected files.

## Approval requirements
List any schema, API, production, security, infrastructure, secret, destructive, or irreversible change.

## Verification evidence
Record exact commands, exit codes, test names, and artifact paths.

## Remaining risks
Document unresolved risks; do not hide them to reach completion.