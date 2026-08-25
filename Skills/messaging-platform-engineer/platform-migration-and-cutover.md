# Platform Migration and Cutover

## Purpose
Migrate messaging workloads between clusters, broker technologies, regions, or managed services without uncontrolled loss, duplication, or consumer downtime.

## When to use
Use for broker replacement, cloud migration, regional relocation, major topology changes, or tenant extraction.

## Inputs
- Source and target platform capabilities
- Destination inventory
- Producer and consumer ownership
- Contract and delivery guarantees
- Cutover window and rollback requirements

## Context to inspect
Inspect schemas, ACLs, retention, partitioning, consumer offsets, client libraries, routing, historical traffic, replay requirements, and operational dashboards.

## Core knowledge
Messaging migrations must handle dual publishing/replication, offset translation, schema parity, destination metadata, duplicate processing, ordering boundaries, and rollback. Technology differences can change semantics even when APIs look similar.

## Procedure
1. Inventory destinations, traffic, consumers, schemas, and guarantees.
2. Identify semantic differences between source and target.
3. Build target destinations, security, schemas, quotas, and observability.
4. Validate representative clients against the target.
5. Choose replication, dual-publish, or drain-and-switch strategy.
6. Define cutover sequence for producers and consumers.
7. Establish idempotency and reconciliation for overlap periods.
8. Define rollback criteria and the latest safe rollback point.
9. Execute a canary workload before broad migration.
10. Verify backlog, duplicates, data gaps, and performance after cutover.
11. Decommission source resources only after the observation window and ownership sign-off.

## Decision points
Use dual-run when low downtime and rollback are essential. Use drain-and-switch when ordering simplicity matters and a maintenance window is acceptable.

## Common failure patterns
- Copying configuration without comparing semantics
- Consumer offsets assumed portable
- Decommissioning source too early
- No duplicate reconciliation during dual publish
- Missing ACL or schema parity

## Verification
Compare source/target message counts and checksums where feasible, run end-to-end business tests, validate consumer positions, and confirm rollback remains possible until exit criteria are met.

## Expected output
A migration plan with semantic-gap analysis, cutover/rollback steps, reconciliation, and verified completion evidence.

## Stop conditions
Stop when target semantics cannot meet required guarantees, consumer ownership is unknown, reconciliation is impossible for critical data, or rollback cannot be performed safely.